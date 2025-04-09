
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { createPoll, updatePoll, Poll, getCandidatesByPoll } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface PollFormProps {
  existingPoll?: Poll;
  onSuccess: () => void;
}

const PollForm: React.FC<PollFormProps> = ({ existingPoll, onSuccess }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pollData, setPollData] = useState<Partial<Poll>>({
    title: '',
    description: '',
    status: 'scheduled',
    candidates: [],
    startDate: Timestamp.fromDate(new Date()),
    endDate: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  });

  useEffect(() => {
    if (existingPoll) {
      setPollData({
        title: existingPoll.title,
        description: existingPoll.description,
        status: existingPoll.status,
        candidates: existingPoll.candidates || [],
        startDate: existingPoll.startDate,
        endDate: existingPoll.endDate
      });
    }
  }, [existingPoll]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPollData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: 'active' | 'scheduled' | 'completed') => {
    setPollData(prev => ({ ...prev, status: value }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setPollData(prev => ({ ...prev, startDate: Timestamp.fromDate(date) }));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setPollData(prev => ({ ...prev, endDate: Timestamp.fromDate(date) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar uma pesquisa.",
        variant: "destructive"
      });
      return;
    }
    
    if (!pollData.title || !pollData.description) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    if (!pollData.startDate || !pollData.endDate) {
      toast({
        title: "Datas inválidas",
        description: "Por favor, selecione datas válidas para início e término.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (existingPoll?.id) {
        await updatePoll(existingPoll.id, pollData);
        toast({
          title: "Sucesso",
          description: "Pesquisa atualizada com sucesso!",
        });
      } else {
        await createPoll({
          ...pollData as Omit<Poll, 'id' | 'createdAt'>,
          createdBy: currentUser.uid,
          candidates: pollData.candidates || []
        });
        toast({
          title: "Sucesso",
          description: "Pesquisa criada com sucesso!",
        });
      }
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar a pesquisa.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingPoll ? 'Editar Pesquisa' : 'Nova Pesquisa'}</CardTitle>
        <CardDescription>
          {existingPoll 
            ? 'Atualize os detalhes da pesquisa existente' 
            : 'Crie uma nova pesquisa eleitoral preenchendo os campos abaixo'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Pesquisa</Label>
            <Input
              id="title"
              name="title"
              value={pollData.title}
              onChange={handleChange}
              placeholder="Ex: Eleições Municipais 2024"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={pollData.description}
              onChange={handleChange}
              placeholder="Descreva o objetivo e contexto desta pesquisa eleitoral"
              required
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {pollData.startDate?.toDate 
                      ? format(pollData.startDate.toDate(), 'PPP', { locale: ptBR })
                      : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={pollData.startDate?.toDate()}
                    onSelect={handleStartDateChange}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Data de Término</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {pollData.endDate?.toDate 
                      ? format(pollData.endDate.toDate(), 'PPP', { locale: ptBR })
                      : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={pollData.endDate?.toDate()}
                    onSelect={handleEndDateChange}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={pollData.status} 
              onValueChange={(value: any) => handleStatusChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Agendada</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="completed">Encerrada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : existingPoll ? 'Atualizar Pesquisa' : 'Criar Pesquisa'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PollForm;
