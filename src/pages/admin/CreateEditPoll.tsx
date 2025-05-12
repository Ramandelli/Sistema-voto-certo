
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import PollForm from '@/components/admin/PollForm';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { getPoll, Poll } from '@/lib/firebase';

const CreateEditPoll = () => {
  const { pollId } = useParams<{ pollId: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(pollId !== 'new');
  const [error, setError] = useState<string | null>(null);
  
  // Fetch poll data if editing an existing poll
  useEffect(() => {
    if (pollId === 'new') {
      console.log("Creating a new poll");
      setLoading(false);
      return;
    }
    
    if (pollId) {
      const fetchPoll = async () => {
        console.log(`Fetching poll data for ID: ${pollId}`);
        try {
          const pollData = await getPoll(pollId);
          if (!pollData) {
            console.log("Poll not found");
            setError('Pesquisa não encontrada');
          } else {
            console.log("Poll data retrieved:", pollData);
            setPoll(pollData);
          }
        } catch (error) {
          console.error('Error fetching poll:', error);
          setError('Erro ao carregar dados da pesquisa');
        } finally {
          setLoading(false);
        }
      };
      
      fetchPoll();
    }
  }, [pollId]);
  
  const handleSuccess = () => {
    navigate('/admin/polls');
  };
  
  const isNewPoll = pollId === 'new';
  
  const pageTitle = isNewPoll ? 'Nova Pesquisa' : 'Editar Pesquisa';

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/admin/polls')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <PollForm 
            existingPoll={poll || undefined} 
            onSuccess={handleSuccess} 
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default CreateEditPoll;
