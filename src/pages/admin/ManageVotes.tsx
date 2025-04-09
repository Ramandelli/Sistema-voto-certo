
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { BarChart, Users } from 'lucide-react';
import { Poll, Candidate, getAllPolls, getCandidatesByPoll, getVoteResults } from '@/lib/firebase';

const ManageVotes = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voteResults, setVoteResults] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const fetchedPolls = await getAllPolls();
        setPolls(fetchedPolls);
        
        // Select the first poll by default if available
        if (fetchedPolls.length > 0 && fetchedPolls[0].id) {
          setSelectedPollId(fetchedPolls[0].id);
        }
      } catch (error) {
        console.error("Error fetching polls:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPolls();
  }, []);
  
  useEffect(() => {
    if (!selectedPollId) return;
    
    const fetchPollData = async () => {
      setLoading(true);
      try {
        // Fetch candidates for the selected poll
        const candidatesData = await getCandidatesByPoll(selectedPollId);
        setCandidates(candidatesData);
        
        // Fetch vote results
        const results = await getVoteResults(selectedPollId);
        setVoteResults(results);
      } catch (error) {
        console.error("Error fetching poll data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPollData();
  }, [selectedPollId]);
  
  const handlePollChange = (pollId: string) => {
    setSelectedPollId(pollId);
  };
  
  const getTotalVotes = () => {
    if (!voteResults) return 0;
    return Object.values(voteResults).reduce((sum, count) => sum + count, 0);
  };
  
  const getSelectedPoll = () => {
    return polls.find(poll => poll.id === selectedPollId);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Resultados das Votações</h1>
          <p className="text-muted-foreground">
            Visualize os resultados e estatísticas das pesquisas eleitorais.
          </p>
        </div>
        
        <div className="w-full sm:w-64">
          <Select 
            value={selectedPollId || ''} 
            onValueChange={handlePollChange}
            disabled={loading || polls.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma pesquisa" />
            </SelectTrigger>
            <SelectContent>
              {polls.map(poll => (
                <SelectItem key={poll.id} value={poll.id || ''}>
                  {poll.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Separator />
        
        {loading ? (
          <p>Carregando dados...</p>
        ) : selectedPollId ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{getSelectedPoll()?.title}</CardTitle>
                <CardDescription>
                  {getSelectedPoll()?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    <span className="text-lg font-medium">{getTotalVotes()} votos totais</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Status: {
                        getSelectedPoll()?.status === 'active' ? 'Ativa' : 
                        getSelectedPoll()?.status === 'scheduled' ? 'Agendada' : 'Concluída'
                      }
                    </span>
                  </div>
                </div>
                
                {getTotalVotes() > 0 ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {candidates.map(candidate => {
                        const voteCount = voteResults?.[candidate.id!] || 0;
                        const totalVotes = getTotalVotes();
                        const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                        
                        return (
                          <div key={candidate.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{candidate.name}</span>
                              <div className="text-right">
                                <div className="font-medium">{voteCount} votos</div>
                                <div className="text-sm text-muted-foreground">
                                  {percentage.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Ainda não há votos registrados para esta pesquisa.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-500">Selecione uma pesquisa para ver os resultados</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageVotes;
