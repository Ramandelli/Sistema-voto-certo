
import React from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Candidate, Poll } from '@/lib/firebase';

interface VoteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  selectedCandidate: Candidate | null;
  poll: Poll | null;
}

const VoteConfirmationModal: React.FC<VoteConfirmationModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  selectedCandidate,
  poll
}) => {
  if (!selectedCandidate || !poll) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar seu voto</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a votar em <strong>{selectedCandidate.name}</strong> na pesquisa <strong>{poll.title}</strong>.
            <br /><br />
            Este voto não poderá ser alterado após a confirmação. Tem certeza que deseja continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirmar Voto</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VoteConfirmationModal;
