
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Candidate } from '@/lib/firebase';
import { ExternalLink, User } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onViewDetails: () => void;
  onVote?: () => void;
  showVoteButton?: boolean;
  isSelected?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onViewDetails,
  onVote,
  showVoteButton = false,
  isSelected = false
}) => {
  return (
    <Card className={`overflow-hidden card-hover h-full flex flex-col ${
      isSelected ? 'border-2 border-primary' : ''
    }`}>
      <CardHeader className="pb-2 space-y-4 flex flex-col items-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={candidate.photoURL} alt={candidate.name} />
          <AvatarFallback>
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <CardTitle className="text-xl">{candidate.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {candidate.biography.substring(0, 100)}
            {candidate.biography.length > 100 ? '...' : ''}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <h4 className="font-semibold text-sm mb-2">Propostas:</h4>
        <p className="text-sm text-muted-foreground line-clamp-4">
          {candidate.proposals.substring(0, 150)}
          {candidate.proposals.length > 150 ? '...' : ''}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onViewDetails}
        >
          <span>Ver Detalhes</span>
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
        
        {showVoteButton && onVote && (
          <Button 
            className="w-full"
            onClick={onVote}
          >
            Votar neste candidato
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
