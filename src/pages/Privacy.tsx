
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Shield, Lock, Database, AlertCircle } from 'lucide-react';

const Privacy = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Política de Privacidade</h1>
          <p className="text-xl text-gray-600">
            Última atualização: 9 de Abril de 2025
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Introdução</h2>
          </div>
          <p className="text-gray-700 mb-4">
            A sua privacidade é importante para nós. É política do Voto Certo respeitar a sua privacidade em relação a qualquer informação que possamos coletar durante a operação do nosso serviço, e outros sites que possuímos e operamos.
          </p>
          <p className="text-gray-700">
            Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Coleta de Informações</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Coletamos as seguintes informações:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li>Informações de cadastro: Nome, e-mail e senha (criptografada)</li>
            <li>Dados demográficos (opcional): idade, gênero, localização</li>
            <li>Opiniões expressas através de votos em pesquisas</li>
            <li>Informações de acesso: endereço IP, navegador utilizado, dispositivo</li>
          </ul>
          <p className="text-gray-700">
            Seus dados são protegidos por processos de criptografia e armazenados em servidores seguros. Dados de votação são anonimizados para proteger a identidade dos participantes.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Uso das Informações</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Utilizamos as informações coletadas para:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li>Autenticar usuários e administrar acessos</li>
            <li>Garantir a integridade das pesquisas (evitar votos duplicados)</li>
            <li>Gerar estatísticas anônimas sobre as pesquisas</li>
            <li>Desenvolver e melhorar nossos serviços</li>
            <li>Personalizar a experiência do usuário</li>
          </ul>
          <p className="text-gray-700">
            Seus dados pessoais nunca serão vendidos a terceiros. Apenas compartilhamos dados anonimizados e agregados para fins estatísticos ou quando legalmente obrigados.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Seus Direitos</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Como usuário do Voto Certo, você tem direito a:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li>Acessar todos os seus dados pessoais que possuímos</li>
            <li>Solicitar a correção de dados incorretos ou desatualizados</li>
            <li>Solicitar a exclusão de seus dados (direito ao esquecimento)</li>
            <li>Revogar o consentimento para processamento de dados</li>
            <li>Receber seus dados em formato portável</li>
          </ul>
          <p className="text-gray-700">
            Para exercer qualquer um desses direitos, entre em contato conosco através do e-mail: privacidade@votocerto.com.br
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Contato</h2>
          <p className="text-gray-700 mb-4">
            Se você tiver alguma dúvida sobre esta política de privacidade ou sobre como seus dados são tratados, entre em contato conosco:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>E-mail: privacidade@votocerto.com.br</li>
            <li>Telefone: (11) 1234-5678</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default Privacy;
