
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Info, Award, UserCheck, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Sobre o Sistema</h1>
          <p className="text-xl text-gray-600">
            Conheça mais sobre a plataforma Voto Certo
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Nossa Missão</h2>
            </div>
            <p className="text-gray-700 mb-4">
              O Voto Certo nasceu com a missão de democratizar o acesso às pesquisas eleitorais, criando um ambiente 
              transparente onde eleitores possam expressar suas opiniões e acompanhar tendências políticas em tempo real.
            </p>
            <p className="text-gray-700">
              Acreditamos que o acesso a informações claras e confiáveis é fundamental para o fortalecimento da democracia 
              e para a tomada de decisões conscientes durante o processo eleitoral.
            </p>
          </section>

          <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Valores e Princípios</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2 text-primary">Transparência</h3>
                <p className="text-gray-700">
                  Todas as nossas pesquisas são conduzidas com metodologia clara e resultados acessíveis a todos os usuários.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-primary">Imparcialidade</h3>
                <p className="text-gray-700">
                  Não temos vínculos com partidos políticos ou candidatos, garantindo a neutralidade das nossas pesquisas.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-primary">Segurança</h3>
                <p className="text-gray-700">
                  Seus dados estão protegidos por tecnologias avançadas e seus votos são sempre anônimos.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2 text-primary">Acessibilidade</h3>
                <p className="text-gray-700">
                  Acreditamos que todos devem ter acesso às pesquisas, por isso nossa plataforma é gratuita e de fácil uso.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Quem Somos</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Somos uma equipe multidisciplinar composta por especialistas em tecnologia, ciência de dados, ciência política e comunicação.
              Todos unidos pelo propósito de criar uma ferramenta que contribua para o fortalecimento do processo democrático no Brasil.
            </p>
            <p className="text-gray-700">
              Fundada em 2024, a plataforma Voto Certo já realizou diversas pesquisas eleitorais em diferentes municípios
              e estados brasileiros, tornando-se referência em pesquisas eleitorais online.
            </p>
          </section>

          <section className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Metodologia</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Todas as pesquisas realizadas na plataforma Voto Certo seguem rigorosos critérios metodológicos para garantir a confiabilidade dos resultados:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Verificação de autenticidade dos usuários</li>
              <li>Prevenção de votos duplicados</li>
              <li>Amostragem representativa</li>
              <li>Análise estatística dos dados</li>
              <li>Transparência na apresentação dos resultados</li>
            </ul>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
