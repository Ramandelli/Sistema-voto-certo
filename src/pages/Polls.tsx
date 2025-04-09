
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PollCard from '@/components/polls/PollCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Poll, getAllPolls } from '@/lib/firebase';

const Polls = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [filteredPolls, setFilteredPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const fetchedPolls = await getAllPolls();
        setPolls(fetchedPolls);
        setFilteredPolls(fetchedPolls);
      } catch (error) {
        console.error("Error fetching polls:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPolls();
  }, []);
  
  useEffect(() => {
    // Apply filters when polls, searchQuery or statusFilter changes
    let result = [...polls];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(poll => 
        poll.title.toLowerCase().includes(query) || 
        poll.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(poll => poll.status === statusFilter);
    }
    
    setFilteredPolls(result);
  }, [polls, searchQuery, statusFilter]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gradient">Pesquisas Eleitorais</h1>
          <p className="text-gray-600">
            Encontre e participe das pesquisas eleitorais disponíveis.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar pesquisa..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="scheduled">Agendados</SelectItem>
                <SelectItem value="completed">Encerrados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Polls Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <p>Carregando pesquisas...</p>
          </div>
        ) : filteredPolls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolls.map(poll => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-500">Nenhuma pesquisa encontrada</p>
            {searchQuery && (
              <p className="mt-2">
                Tente ajustar seus filtros ou termos de busca.
              </p>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Polls;
