
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, User, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createCandidate, updateCandidate, Candidate, uploadCandidatePhoto, Poll, getAllPolls } from '@/lib/firebase';

interface CandidateFormProps {
  existingCandidate?: Candidate;
  pollId?: string;
  onSuccess: () => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ existingCandidate, pollId, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [candidateData, setCandidateData] = useState<Partial<Candidate>>({
    name: '',
    biography: '',
    proposals: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      website: ''
    },
    photoURL: '',
    pollId: pollId || ''
  });

  useEffect(() => {
    if (existingCandidate) {
      setCandidateData({
        name: existingCandidate.name,
        biography: existingCandidate.biography,
        proposals: existingCandidate.proposals,
        socialLinks: existingCandidate.socialLinks,
        photoURL: existingCandidate.photoURL,
        pollId: existingCandidate.pollId
      });
      setPhotoPreview(existingCandidate.photoURL);
    }
    
    // Fetch available polls
    const fetchPolls = async () => {
      try {
        const allPolls = await getAllPolls();
        setPolls(allPolls);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };
    
    fetchPolls();
  }, [existingCandidate, pollId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social.')) {
      const socialType = name.split('.')[1];
      setCandidateData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialType]: value
        }
      }));
    } else {
      setCandidateData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePollChange = (value: string) => {
    setCandidateData(prev => ({ ...prev, pollId: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!candidateData.name || !candidateData.biography || !candidateData.proposals || !candidateData.pollId) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      let photoURL = candidateData.photoURL || '';
      
      // Upload photo if a new one was selected
      if (photoFile) {
        const candidateId = existingCandidate?.id || `temp-${Date.now()}`;
        photoURL = await uploadCandidatePhoto(photoFile, candidateId);
      }
      
      if (existingCandidate?.id) {
        await updateCandidate(existingCandidate.id, {
          ...candidateData,
          photoURL
        });
        toast({
          title: "Sucesso",
          description: "Candidato atualizado com sucesso!",
        });
      } else {
        await createCandidate({
          ...candidateData as Omit<Candidate, 'id' | 'createdAt'>,
          photoURL
        });
        toast({
          title: "Sucesso",
          description: "Candidato cadastrado com sucesso!",
        });
      }
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar o candidato.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingCandidate ? 'Editar Candidato' : 'Novo Candidato'}</CardTitle>
        <CardDescription>
          {existingCandidate 
            ? 'Atualize os detalhes do candidato existente' 
            : 'Cadastre um novo candidato preenchendo os campos abaixo'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="flex justify-center mb-4">
            <div className="space-y-2 text-center">
              <Avatar className="h-32 w-32 mx-auto">
                {photoPreview ? (
                  <AvatarImage src={photoPreview} alt="Preview" />
                ) : (
                  <AvatarFallback>
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <Label htmlFor="photo" className="cursor-pointer">
                  <div className="flex items-center justify-center text-sm text-primary">
                    <Upload className="h-4 w-4 mr-1" />
                    {photoPreview ? 'Trocar foto' : 'Adicionar foto'}
                  </div>
                </Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Candidato</Label>
            <Input
              id="name"
              name="name"
              value={candidateData.name}
              onChange={handleChange}
              placeholder="Nome completo do candidato"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="biography">Biografia</Label>
            <Textarea
              id="biography"
              name="biography"
              value={candidateData.biography}
              onChange={handleChange}
              placeholder="Biografia detalhada do candidato"
              required
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="proposals">Propostas</Label>
            <Textarea
              id="proposals"
              name="proposals"
              value={candidateData.proposals}
              onChange={handleChange}
              placeholder="Principais propostas do candidato"
              required
              rows={6}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pollId">Pesquisa</Label>
            <Select 
              value={candidateData.pollId} 
              onValueChange={handlePollChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a pesquisa" />
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
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Redes Sociais (opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="social.facebook">Facebook</Label>
                <Input
                  id="social.facebook"
                  name="social.facebook"
                  value={candidateData.socialLinks?.facebook || ''}
                  onChange={handleChange}
                  placeholder="URL do Facebook"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social.twitter">Twitter</Label>
                <Input
                  id="social.twitter"
                  name="social.twitter"
                  value={candidateData.socialLinks?.twitter || ''}
                  onChange={handleChange}
                  placeholder="URL do Twitter"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social.instagram">Instagram</Label>
                <Input
                  id="social.instagram"
                  name="social.instagram"
                  value={candidateData.socialLinks?.instagram || ''}
                  onChange={handleChange}
                  placeholder="URL do Instagram"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social.website">Website</Label>
                <Input
                  id="social.website"
                  name="social.website"
                  value={candidateData.socialLinks?.website || ''}
                  onChange={handleChange}
                  placeholder="URL do website pessoal"
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : existingCandidate ? 'Atualizar Candidato' : 'Cadastrar Candidato'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CandidateForm;
