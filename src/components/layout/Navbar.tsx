
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { logoutUser } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, LogIn, UserPlus, BarChart } from 'lucide-react';

const Navbar = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logout realizado",
        description: "Você saiu do sistema com sucesso.",
      });
      navigate('/');
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold flex items-center">
              <BarChart className="mr-2 h-6 w-6" />
              <span>Voto Certo</span>
            </Link>
            
            <nav className="hidden md:flex space-x-4">
              <Link to="/" className="hover:text-white/80 transition">Início</Link>
              <Link to="/polls" className="hover:text-white/80 transition">Pesquisas</Link>
              {userRole?.isAdmin && (
                <Link to="/admin" className="hover:text-white/80 transition">
                  Painel Admin
                </Link>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentUser ? (
              <Button 
                variant="outline" 
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                  onClick={() => navigate('/login')}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Entrar</span>
                </Button>
                <Button 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => navigate('/register')}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Cadastrar</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
