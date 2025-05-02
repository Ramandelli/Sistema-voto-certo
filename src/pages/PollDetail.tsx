import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import CandidateCard from '@/components/polls/CandidateCard';
import CandidateDetailModal from '@/components/polls/CandidateDetailModal';
import VoteConfirmationModal from '@/components/polls/VoteConfirmationModal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getPoll, 
  getCandidatesByPoll, 
  Poll, 
  Candidate, 
  castVote,
  hasUserVoted,
  getVoteResults
} from '@/lib/firebase';
import { 
  AlertCircle, 
  CalendarDays,
  Users, 
  CheckCircle, 
  BarChart 
} from 'lucide-react';

const PollDetail = () => {
  const { pollId } = useParams<{ pollId: string }>();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [poll, setPoll] = useState<Poll | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [viewCandidateDetail, setViewCandidateDetail] = useState<Candidate | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasVoted, setHasVoted] = useState<boolean | null>(null);
  const [voteResults, setVoteResults] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!pollId) {
      setError("ID da pesquisa não fornecido");
      setLoading(false);
      return;
    }
    
    const fetchPollData = async () => {
      try {
        const pollData = await getPoll(pollId);
        if (!pollData) {
          setError("Pesquisa não encontrada");
          setLoading(false);
          return;
        }
        
        setPoll(pollData);
        
        // Fetch candidates
        const candidatesData = await getCandidatesByPoll(pollId);
        setCandidates(candidatesData);
        
        // Always fetch results for all users
        const results = await getVoteResults(pollId);
        setVoteResults(results);
        
        // Check if user has voted (only if logged in)
        if (currentUser) {
          const voted = await hasUserVoted(currentUser.uid, pollId);
          setHasVoted(voted);
        }
      } catch (error) {
        console.error("Error fetching poll data:", error);
        setError("Erro ao carregar dados da pesquisa");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPollData();
  }, [pollId, currentUser]);
  
  const handleVoteClick = (candidate: Candidate) => {
    if (!currentUser) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para votar.",
        variant: "destructive"
      });
      return;
    }
    
    if (hasVoted) {
      toast({
        title: "Você já votou",
        description: "Você já registrou seu voto nesta pesquisa.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedCandidate(candidate);
    setShowConfirmation(true);
  };
  
  const handleConfirmVote = async () => {
    if (!currentUser || !selectedCandidate || !pollId) return;
    
    try {
      await castVote({
        userId: currentUser.uid,
        pollId: pollId,
        candidateId: selectedCandidate.id!
      });
      
      toast({
        title: "Voto registrado",
        description: "Seu voto foi registrado com sucesso!",
      });
      
      // Update state
      setHasVoted(true);
      setShowConfirmation(false);
      
      // Fetch updated results
      const results = await getVoteResults(pollId);
      setVoteResults(results);
    } catch (error: any) {
      console.error("Error casting vote:", error);
      toast({
        title: "Erro ao votar",
        description: error.message || "Ocorreu um erro ao registrar seu voto.",
        variant: "destructive"
      });
    }
  };
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativa</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="text-orange-500 border-orange-500">Agendada</Badge>;
      case 'completed':
        return <Badge variant="secondary">Encerrada</Badge>;
      default:
        return null;
    }
  };
  
  const getTotalVotes = () => {
    if (!voteResults) return 0;
    return Object.values(voteResults).reduce((sum, count) => sum + count, 0);
  };
  
  const isPollActive = () => {
    if (!poll) return false;
    
    const now = new Date();
    const startDate = poll.startDate.toDate();
    const endDate = poll.endDate.toDate();
    
    return poll.status === 'active' && now >= startDate && now <= endDate;
  };
  
  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Button variant="outline" onClick={() => window.history.back()}>
              Voltar
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <p className="text-center">Carregando dados da pesquisa...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!poll) {
    return <Navigate to="/polls" replace />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gradient">{poll?.title}</h1>
              <p className="text-gray-600 max-w-3xl">
                {poll?.description}
              </p>
            </div>
            <div>{poll && getStatusBadge(poll.status)}</div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" />
              <span>
                {formatDate(poll?.startDate)} até {formatDate(poll?.endDate)}
              </span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{candidates.length} candidatos</span>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {!isPollActive() && poll?.status !== 'completed' && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Pesquisa não está ativa</AlertTitle>
            <AlertDescription>
              {poll?.status === 'scheduled' 
                ? `Esta pesquisa está agendada para iniciar em ${formatDate(poll.startDate)}.`
                : "Esta pesquisa não está disponível para votação no momento."}
            </AlertDescription>
          </Alert>
        )}
        
        {hasVoted && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Voto registrado</AlertTitle>
            <AlertDescription>
              Você já votou nesta pesquisa. Obrigado pela participação!
            </AlertDescription>
          </Alert>
        )}
        
        {/* Results section (always shown) */}
        {voteResults && (
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Resultados da Pesquisa</h2>
            </div>
            
            <div className="space-y-4">
              {candidates.map(candidate => {
                const voteCount = voteResults[candidate.id!] || 0;
                const totalVotes = getTotalVotes();
                const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                
                return (
                  <div key={candidate.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{candidate.name}</span>
                      <span>{voteCount} votos ({percentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
              
              <div className="text-sm text-gray-500 text-right mt-2">
                Total: {getTotalVotes()} votos
              </div>
            </div>
          </div>
        )}
        
        {/* Candidates section */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Candidatos</h2>
          
          {candidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map(candidate => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onViewDetails={() => setViewCandidateDetail(candidate)}
                  onVote={() => handleVoteClick(candidate)}
                  showVoteButton={isPollActive() && !hasVoted && !!currentUser}
                  isSelected={selectedCandidate?.id === candidate.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Nenhum candidato cadastrado para esta pesquisa.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Candidate Detail Modal */}
      <CandidateDetailModal
        candidate={viewCandidateDetail}
        open={!!viewCandidateDetail}
        onOpenChange={(open) => {
          if (!open) setViewCandidateDetail(null);
        }}
        onVote={
          viewCandidateDetail && isPollActive() && !hasVoted && !!currentUser
            ? () => handleVoteClick(viewCandidateDetail)
            : undefined
        }
        showVoteButton={isPollActive() && !hasVoted && !!currentUser}
      />
      
      {/* Vote Confirmation Modal */}
      <VoteConfirmationModal
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleConfirmVote}
        selectedCandidate={selectedCandidate}
        poll={poll}
      />
    </MainLayout>
  );
};

export default PollDetail;
