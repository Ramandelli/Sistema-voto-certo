import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart2, 
  ListChecks, 
  Users, 
  Settings, 
  HelpCircle,
  LayoutDashboard,
  Vote,
  Home
} from 'lucide-react';

const AdminSidebar = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
      isActive 
        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
        : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground'
    }`;

  return (
    <div className="h-screen bg-sidebar w-64 py-6 px-3 flex flex-col">
      {/* Cabeçalho */}
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold text-sidebar-foreground flex items-center">
          <BarChart2 className="mr-2 h-6 w-6" />
          Voto Certo Admin
        </h2>
      </div>
      
      {/* Lista principal com scroll */}
      <nav className="flex-grow overflow-y-auto space-y-1">
        <NavLink to="/admin" end className={navLinkClass}>
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </NavLink>
        <NavLink to="/admin/polls" className={navLinkClass}>
          <ListChecks className="h-5 w-5" />
          Pesquisas
        </NavLink>
        <NavLink to="/admin/candidates" className={navLinkClass}>
          <Users className="h-5 w-5" />
          Candidatos
        </NavLink>
        <NavLink to="/admin/votes" className={navLinkClass}>
          <Vote className="h-5 w-5" />
          Votos
        </NavLink>
        <NavLink to="/admin/settings" className={navLinkClass}>
          <Settings className="h-5 w-5" />
          Configurações
        </NavLink>
      </nav>

      {/* Seção inferior fixa (sem scroll) */}
      <div className="mt-auto pt-6 border-t border-sidebar-border">
        <NavLink to="/" className={navLinkClass}>
          <Home className="h-5 w-5" />
          Voltar para Home
        </NavLink>
        <NavLink to="/admin/help" className={`${navLinkClass} mt-1`}>
          <HelpCircle className="h-5 w-5" />
          Ajuda
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;