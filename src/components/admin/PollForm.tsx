
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
import { 
  createPoll, 
  updatePoll, 
  Poll, 
  Candidate, 
  getAllCandidates 
} from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface PollFormProps {
  existingPoll?: Poll;
  onSuccess: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  status: z.enum(["active", "scheduled", "completed"]),
  selectedCandidates: z.array(z.string()).min(1, "Selecione pelo menos um candidato"),
  startDate: z.instanceof(Timestamp),
  endDate: z.instanceof(Timestamp),
});

const PollForm: React.FC<PollFormProps> = ({ existingPoll, onSuccess }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  
  console.log("PollForm rendered with existingPoll:", existingPoll);
  
  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: existingPoll?.title || '',
      description: existingPoll?.description || '',
      status: existingPoll?.status || 'scheduled',
      selectedCandidates: existingPoll?.candidates || [],
      startDate: existingPoll?.startDate || Timestamp.fromDate(new Date()),
      endDate: existingPoll?.endDate || Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    }
  });
  
  // Load candidates only once on mount
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        console.log("Fetching all candidates");
        const candidates = await getAllCandidates();
        console.log("Fetched candidates:", candidates);
        setAllCandidates(candidates);
      } catch (error) {
        console.error("Erro ao buscar candidatos:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os candidatos",
          variant: "destructive"
        });
      } finally {
        setLoadingCandidates(false);
      }
    };

    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Handle candidate selection
  const toggleCandidateSelection = (candidateId: string) => {
    const currentSelectedCandidates = form.getValues("selectedCandidates");
    
    const newSelection = currentSelectedCandidates.includes(candidateId)
      ? currentSelectedCandidates.filter(id => id !== candidateId)
      : [...currentSelectedCandidates, candidateId];
    
    console.log(`Toggling candidate ${candidateId}, new selection:`, newSelection);
    form.setValue("selectedCandidates", newSelection, { shouldValidate: true });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      form.setValue("startDate", Timestamp.fromDate(date), { shouldValidate: true });
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      form.setValue("endDate", Timestamp.fromDate(date), { shouldValidate: true });
    }
  };

  const handleStatusChange = (value: 'active' | 'scheduled' | 'completed') => {
    form.setValue("status", value, { shouldValidate: true });
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!currentUser) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar uma pesquisa.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Form submitted with data:", data);
      
      const pollData = {
        title: data.title,
        description: data.description,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        candidates: data.selectedCandidates
      };
      
      console.log("Preparing poll data:", pollData);

      if (existingPoll?.id) {
        await updatePoll(existingPoll.id, pollData);
        toast({
          title: "Sucesso",
          description: "Pesquisa atualizada com sucesso!",
        });
      } else {
        await createPoll({
          ...pollData,
          createdBy: currentUser.uid,
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Pesquisa</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Eleições Municipais 2024"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o objetivo e contexto desta pesquisa eleitoral"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                      {form.watch("startDate")?.toDate 
                        ? format(form.watch("startDate").toDate(), 'PPP', { locale: ptBR })
                        : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch("startDate")?.toDate()}
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
                      {form.watch("endDate")?.toDate 
                        ? format(form.watch("endDate").toDate(), 'PPP', { locale: ptBR })
                        : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch("endDate")?.toDate()}
                      onSelect={handleEndDateChange}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={form.watch("status")}
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
            
            <FormField
              control={form.control}
              name="selectedCandidates"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base">Selecione os candidatos para esta pesquisa</FormLabel>
                  <FormControl>
                    <>
                      {loadingCandidates ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          <span className="ml-2 text-muted-foreground">Carregando candidatos...</span>
                        </div>
                      ) : allCandidates.length > 0 ? (
                        <div className="border rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">Selecionar</TableHead>
                                <TableHead>Candidato</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {allCandidates.map((candidate) => {
                                const isSelected = candidate.id ? 
                                  form.watch("selectedCandidates").includes(candidate.id) : false;
                                  
                                return (
                                  <TableRow 
                                    key={candidate.id} 
                                    className="cursor-pointer hover:bg-muted"
                                    onClick={() => candidate.id && toggleCandidateSelection(candidate.id)}
                                  >
                                    <TableCell className="w-12">
                                      <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => candidate.id && toggleCandidateSelection(candidate.id)}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center space-x-3">
                                        <Avatar className="h-10 w-10">
                                          <AvatarImage src={candidate.photoURL} alt={candidate.name} />
                                          <AvatarFallback>{candidate.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <div className="font-medium">{candidate.name}</div>
                                          <div className="text-sm text-muted-foreground line-clamp-1">
                                            {candidate.biography.substring(0, 100)}
                                            {candidate.biography.length > 100 ? '...' : ''}
                                          </div>
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center p-4 border rounded-md">
                          <p>Nenhum candidato cadastrado. <a href="/admin/candidates/new" className="text-primary hover:underline">Cadastre candidatos</a> para adicioná-los à pesquisa.</p>
                        </div>
                      )}
                    </>
                  </FormControl>
                  {form.watch("selectedCandidates").length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {form.watch("selectedCandidates").length} candidato(s) selecionado(s)
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
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
      </Form>
    </Card>
  );
};

export default PollForm;
