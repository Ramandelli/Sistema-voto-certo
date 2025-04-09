
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Poll, getAllPolls } from '@/lib/firebase';
import { CalendarDays, Edit, Plus, Search, Trash2 } from 'lucide-react';

const ManagePolls = () => {
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

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerenciar Pesquisas</h1>
            <p className="text-muted-foreground">
              Crie, edite e gerencie todas as pesquisas eleitorais do sistema.
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/polls/new">
              <Plus className="mr-2 h-4 w-4" />
              Nova Pesquisa
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
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
        
        <Separator />
        
        {loading ? (
          <p>Carregando pesquisas...</p>
        ) : filteredPolls.length > 0 ? (
          <div className="space-y-4">
            {filteredPolls.map(poll => (
              <Card key={poll.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{poll.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {poll.description}
                        </p>
                      </div>
                      <div>{getStatusBadge(poll.status)}</div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      <span>
                        {formatDate(poll.startDate)} até {formatDate(poll.endDate)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/admin/polls/${poll.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/polls/${poll.id}`} target="_blank">
                          Visualizar
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
    </AdminLayout>
  );
};

export default ManagePolls;
