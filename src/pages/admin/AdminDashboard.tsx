
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  ListChecks, 
  Users, 
  Vote, 
  ArrowRight, 
  AlertCircle,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Poll, getAllPolls } from '@/lib/firebase';

const AdminDashboard = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPolls: 0,
    activePolls: 0,
    scheduledPolls: 0,
    completedPolls: 0
  });
  
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const fetchedPolls = await getAllPolls();
        setPolls(fetchedPolls);
        
        // Calculate stats
        const totalPolls = fetchedPolls.length;
        const activePolls = fetchedPolls.filter(poll => poll.status === 'active').length;
        const scheduledPolls = fetchedPolls.filter(poll => poll.status === 'scheduled').length;
        const completedPolls = fetchedPolls.filter(poll => poll.status === 'completed').length;
        
        setStats({
          totalPolls,
          activePolls,
          scheduledPolls,
          completedPolls
        });
      } catch (error) {
        console.error("Error fetching polls:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPolls();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
          <div className="flex justify-between items-center mb-2">
            <p className="text-muted-foreground">
               Bem-vindo ao painel de controle do sistema de pesquisas eleitorais.
            </p>
            <Button variant="outline" asChild>
              <Link to="/">
                ← Voltar para a Home
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Total de Pesquisas</CardTitle>
              <ListChecks className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPolls}</div>
              <p className="text-xs text-muted-foreground">
                Pesquisas cadastradas no sistema
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Pesquisas Ativas</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activePolls}</div>
              <p className="text-xs text-muted-foreground">
                Pesquisas em andamento
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Pesquisas Agendadas</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scheduledPolls}</div>
              <p className="text-xs text-muted-foreground">
                Pesquisas com início futuro
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Pesquisas Concluídas</CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedPolls}</div>
              <p className="text-xs text-muted-foreground">
                Pesquisas finalizadas
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Pesquisas</CardTitle>
              <CardDescription>
                Crie, edite e gerencie as pesquisas eleitorais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/admin/polls/new">
                  Criar Nova Pesquisa
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/admin/polls">
                  Ver Todas as Pesquisas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Candidatos</CardTitle>
              <CardDescription>
                Adicione e atualize dados dos candidatos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/admin/candidates/new">
                  Cadastrar Novo Candidato
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/admin/candidates">
                  Ver Todos os Candidatos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Polls */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Pesquisas Recentes</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : polls.length > 0 ? (
            <div className="space-y-4">
              {polls.slice(0, 5).map(poll => (
                <Card key={poll.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="font-medium">{poll.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Status: {
                            poll.status === 'active' ? 'Ativa' : 
                            poll.status === 'scheduled' ? 'Agendada' : 'Concluída'
                          }
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/polls/${poll.id}`}>
                          <span>Gerenciar</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhuma pesquisa cadastrada.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
