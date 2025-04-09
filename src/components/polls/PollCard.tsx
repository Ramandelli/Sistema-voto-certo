
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, ExternalLink } from 'lucide-react';
import { Poll } from '@/lib/firebase';

interface PollCardProps {
  poll: Poll;
  candidateCount?: number;
}

const PollCard: React.FC<PollCardProps> = ({ poll, candidateCount = 0 }) => {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativa</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="text-orange-500 border-orange-500">Agendada</Badge>;
      case 'completed':
        return <Badge variant="secondary">Encerrada</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden card-hover">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle>{poll.title}</CardTitle>
          {getStatusBadge(poll.status)}
        </div>
        <CardDescription>{poll.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2" />
            <span>
              {formatDate(poll.startDate)} até {formatDate(poll.endDate)}
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>{candidateCount || poll.candidates?.length || 0} candidatos</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/polls/${poll.id}`}>
            <span>Ver Pesquisa</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PollCard;
