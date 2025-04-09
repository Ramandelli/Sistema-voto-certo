
import React from 'react';
import { BarChart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BarChart className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-primary">Voto Certo</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8 text-center md:text-left">
            <div className="mb-4 md:mb-0">
              <h4 className="font-semibold mb-2">Sistema de Pesquisas</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><a href="/" className="hover:text-primary">Início</a></li>
                <li><a href="/polls" className="hover:text-primary">Pesquisas Ativas</a></li>
                <li><a href="/about" className="hover:text-primary">Sobre o Sistema</a></li>
              </ul>
            </div>
            
            <div className="mb-4 md:mb-0">
              <h4 className="font-semibold mb-2">Conta</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><a href="/login" className="hover:text-primary">Entrar</a></li>
                <li><a href="/register" className="hover:text-primary">Cadastrar</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Legal</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li><a href="/privacy" className="hover:text-primary">Política de Privacidade</a></li>
                <li><a href="/terms" className="hover:text-primary">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Voto Certo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
