import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, CheckCircle, Users } from 'lucide-react';
import PollCard from '@/components/polls/PollCard';
import MainLayout from '@/components/layout/MainLayout';
import { Poll, getAllPolls } from '@/lib/firebase';

const Index = () => {
  const [activePolls, setActivePolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchActivePolls = async () => {
      try {
        // Carrega todas as pesquisas
        const polls = await getAllPolls();
        // Filtra apenas as pesquisas com status "active"
        const actives = polls.filter(poll => poll.status === 'active');
        setActivePolls(actives);
      } catch (error) {
        console.error("Error fetching active polls:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivePolls();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-primary/80 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Sistema de Pesquisas Eleitorais
              </h1>
              <p className="text-xl opacity-90">
                Participe de pesquisas eleitorais e faça sua voz ser ouvida. Um sistema completo para conhecer candidatos e expressar sua opinião.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90"
                  asChild
                >
                  <Link to="/polls">
                    Ver Pesquisas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90"
                  asChild
                >
                  <Link to="/register">
                    Cadastre-se
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="aspect-square max-w-md mx-auto bg-white/10 rounded-full p-12">
                <BarChart2 className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient">Como Funciona</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Conheça os Candidatos</h3>
              <p className="text-gray-600">
                Explore detalhes sobre cada candidato, suas propostas e histórico para fazer uma escolha informada.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Registre Seu Voto</h3>
              <p className="text-gray-600">
                Participe das pesquisas ativas e registre seu voto de forma segura e confidencial.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Acompanhe Resultados</h3>
              <p className="text-gray-600">
                Visualize estatísticas e resultados em tempo real das pesquisas realizadas.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Active Polls Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gradient">Pesquisas Ativas</h2>
            <Button variant="outline" asChild>
              <Link to="/polls">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <p>Carregando pesquisas...</p>
            </div>
          ) : activePolls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePolls.slice(0, 3).map(poll => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">Não há pesquisas ativas no momento.</p>
              <p className="mt-2">Volte em breve para novas pesquisas.</p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
