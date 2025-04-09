
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import CandidateForm from '@/components/admin/CandidateForm';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { getCandidate, Candidate } from '@/lib/firebase';

const CreateEditCandidate = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(candidateId !== 'new');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (candidateId === 'new') {
      setLoading(false);
      return;
    }
    
    if (candidateId) {
      const fetchCandidate = async () => {
        try {
          const candidateData = await getCandidate(candidateId);
          if (!candidateData) {
            setError('Candidato não encontrado');
          } else {
            setCandidate(candidateData);
          }
        } catch (error) {
          console.error('Error fetching candidate:', error);
          setError('Erro ao carregar dados do candidato');
        } finally {
          setLoading(false);
        }
      };
      
      fetchCandidate();
    }
  }, [candidateId]);
  
  const handleSuccess = () => {
    navigate('/admin/candidates');
  };
  
  const isNewCandidate = candidateId === 'new';
  
  const pageTitle = isNewCandidate ? 'Novo Candidato' : 'Editar Candidato';

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/admin/candidates')} className="mr-4">
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
          <CandidateForm 
            existingCandidate={candidate || undefined}
            onSuccess={handleSuccess} 
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default CreateEditCandidate;
