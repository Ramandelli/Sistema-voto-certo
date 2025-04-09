
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Candidate } from '@/lib/firebase';
import { Facebook, Globe, Instagram, Twitter, User } from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVote?: () => void;
  showVoteButton?: boolean;
}

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  open,
  onOpenChange,
  onVote,
  showVoteButton = false
}) => {
  if (!candidate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={candidate.photoURL} alt={candidate.name} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{candidate.name}</DialogTitle>
              <DialogDescription className="mt-1">
                Candidato
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 my-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Biografia</h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {candidate.biography}
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Propostas</h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {candidate.proposals}
            </p>
          </div>
          
          {Object.values(candidate.socialLinks || {}).some(link => link) && (
            <>
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Redes Sociais</h3>
                <div className="flex gap-3">
                  {candidate.socialLinks?.facebook && (
                    <a 
                      href={candidate.socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                  {candidate.socialLinks?.twitter && (
                    <a 
                      href={candidate.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-blue-100 text-blue-400 hover:bg-blue-200"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {candidate.socialLinks?.instagram && (
                    <a 
                      href={candidate.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  {candidate.socialLinks?.website && (
                    <a 
                      href={candidate.socialLinks.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          {showVoteButton && onVote && (
            <Button onClick={onVote} className="w-full">
              Votar neste candidato
            </Button>
          )}
          {!showVoteButton && (
            <Button onClick={() => onOpenChange(false)} variant="outline" className="w-full">
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDetailModal;
