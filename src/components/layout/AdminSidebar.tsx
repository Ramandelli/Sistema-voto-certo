
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
  ArrowLeft
} from 'lucide-react';

const AdminSidebar = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
      isActive 
        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
        : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground'
    }`;

  return (
    <div className="h-screen overflow-y-auto bg-sidebar w-64 py-6 px-3 flex flex-col">
      <div className="px-4 mb-8">
        <h2 className="text-xl font-bold text-sidebar-foreground flex items-center">
          <BarChart2 className="mr-2 h-6 w-6" />
          Voto Certo Admin
        </h2>
      </div>
      
      <nav className="space-y-1 flex-grow">
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
        <hr className="my-2 border-t border-gray-300" />
        <NavLink to="/" className={navLinkClass}>
          <ArrowLeft className="h-5 w-5" />
          Voltar para Home
        </NavLink>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-sidebar-border">
        <NavLink to="/admin/help" className={navLinkClass}>
          <HelpCircle className="h-5 w-5" />
          Ajuda
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
