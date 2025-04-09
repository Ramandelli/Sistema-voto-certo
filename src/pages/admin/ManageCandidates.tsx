
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Candidate, Poll, getAllPolls, getCandidatesByPoll } from '@/lib/firebase';
import { Edit, Plus, Search, User } from 'lucide-react';

const ManageCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pollFilter, setPollFilter] = useState('all');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all polls
        const fetchedPolls = await getAllPolls();
        setPolls(fetchedPolls);
        
        // Fetch candidates from all polls
        let allCandidates: Candidate[] = [];
        
        for (const poll of fetchedPolls) {
          if (poll.id) {
            const pollCandidates = await getCandidatesByPoll(poll.id);
            allCandidates = [...allCandidates, ...pollCandidates];
          }
        }
        
        setCandidates(allCandidates);
        setFilteredCandidates(allCandidates);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    // Apply filters when candidates, searchQuery or pollFilter changes
    let result = [...candidates];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(candidate => 
        candidate.name.toLowerCase().includes(query) || 
        candidate.biography.toLowerCase().includes(query)
      );
    }
    
    // Filter by poll
    if (pollFilter !== 'all') {
      result = result.filter(candidate => candidate.pollId === pollFilter);
    }
    
    setFilteredCandidates(result);
  }, [candidates, searchQuery, pollFilter]);
  
  const getPollBadge = (pollId: string | undefined) => {
    if (!pollId) return null;
    
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return null;
    
    return (
      <Badge variant="outline" className="text-primary border-primary">
        {poll.title}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerenciar Candidatos</h1>
            <p className="text-muted-foreground">
              Adicione e gerencie os candidatos das pesquisas eleitorais.
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/candidates/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Candidato
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar candidato..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="sm:w-64">
            <Select 
              value={pollFilter} 
              onValueChange={setPollFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por pesquisa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as pesquisas</SelectItem>
                {polls.map(poll => (
                  <SelectItem key={poll.id} value={poll.id || ''}>
                    {poll.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Separator />
        
        {loading ? (
          <p>Carregando candidatos...</p>
        ) : filteredCandidates.length > 0 ? (
          <div className="space-y-4">
            {filteredCandidates.map(candidate => (
              <Card key={candidate.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={candidate.photoURL} alt={candidate.name} />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{candidate.name}</h3>
                        {getPollBadge(candidate.pollId)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {candidate.biography}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/admin/candidates/${candidate.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </Button>
                      {candidate.pollId && (
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/polls/${candidate.pollId}`} target="_blank">
                            Visualizar na Pesquisa
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-500">Nenhum candidato encontrado</p>
            {(searchQuery || pollFilter !== 'all') && (
              <p className="mt-2">
                Tente ajustar seus filtros ou termos de busca.
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageCandidates;
