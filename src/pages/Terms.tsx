
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FileText, AlertTriangle, FileCheck, Scale } from 'lucide-react';

const Terms = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Termos de Uso</h1>
          <p className="text-xl text-gray-600">
            Última atualização: 9 de Abril de 2025
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Aceitação dos Termos</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Ao acessar e usar o sistema Voto Certo, você aceita e concorda em cumprir todos os termos e condições estabelecidos neste documento. Se você não concordar com algum aspecto destes termos, recomendamos que não utilize nossos serviços.
          </p>
          <p className="text-gray-700">
            Estes termos podem ser atualizados periodicamente sem aviso prévio. É sua responsabilidade verificar regularmente se houve alterações. O uso contínuo da plataforma após a publicação de alterações constitui aceitação dessas mudanças.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Uso do Serviço</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-primary">Cadastro e Conta</h3>
              <p className="text-gray-700">
                Para utilizar todos os recursos da plataforma, é necessário criar uma conta. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas com sua conta. Informações falsas, imprecisas ou desatualizadas podem resultar no cancelamento imediato da sua conta.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-primary">Condutas Proibidas</h3>
              <p className="text-gray-700 mb-2">
                Ao utilizar o Voto Certo, você concorda em não:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Utilizar o serviço para atividades ilegais ou não autorizadas</li>
                <li>Criar múltiplas contas para manipular resultados de pesquisas</li>
                <li>Compartilhar conteúdo ofensivo, difamatório ou que viole direitos de terceiros</li>
                <li>Tentar acessar áreas restritas do sistema sem autorização</li>
                <li>Interferir no funcionamento normal da plataforma</li>
                <li>Utilizar bots, crawlers ou outros meios automatizados para acessar o serviço</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-primary">Participação em Pesquisas</h3>
              <p className="text-gray-700">
                Ao participar das pesquisas eleitorais, você declara que está expressando sua opinião genuína e que está votando apenas uma vez por pesquisa. A manipulação de resultados pode resultar na suspensão permanente da sua conta.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <FileCheck className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Propriedade Intelectual</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Todo o conteúdo disponível na plataforma Voto Certo, incluindo mas não limitado a textos, gráficos, logotipos, ícones, imagens, áudios, vídeos e software, é propriedade exclusiva do Voto Certo ou de seus fornecedores de conteúdo, e está protegido por leis de direitos autorais.
          </p>
          <p className="text-gray-700">
            O uso não autorizado deste conteúdo é expressamente proibido. Você pode visualizar e baixar materiais apenas para seu uso pessoal e não comercial, desde que mantenha intactos todos os avisos de direitos autorais e outros avisos de propriedade.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <AlertTriangle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Limitação de Responsabilidade</h2>
          </div>
          <p className="text-gray-700 mb-4">
            O Voto Certo se esforça para fornecer informações precisas e atualizadas, mas não garante a exatidão, integridade ou atualidade dessas informações. As pesquisas eleitorais são baseadas em amostras e representam tendências, não necessariamente resultados definitivos.
          </p>
          <p className="text-gray-700 mb-4">
            A plataforma é fornecida "como está" e "conforme disponível", sem garantias de qualquer tipo, expressas ou implícitas. Não garantimos que o serviço será ininterrupto, seguro ou livre de erros.
          </p>
          <p className="text-gray-700">
            Em nenhuma circunstância o Voto Certo, seus diretores, funcionários ou agentes serão responsáveis por quaisquer danos diretos, indiretos, incidentais, especiais, punitivos ou consequentes resultantes do uso ou incapacidade de uso deste serviço.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Disposições Gerais</h2>
          <p className="text-gray-700 mb-4">
            Estes Termos de Uso constituem o acordo completo entre você e o Voto Certo em relação ao uso da plataforma. Qualquer falha do Voto Certo em exercer ou fazer cumprir qualquer direito ou disposição destes termos não constituirá uma renúncia a tal direito ou disposição.
          </p>
          <p className="text-gray-700 mb-4">
            Se qualquer disposição destes Termos for considerada inválida ou inexequível por um tribunal, as demais disposições permanecerão em vigor. Estes termos não criam qualquer relação de agência, parceria, emprego ou franquia entre você e o Voto Certo.
          </p>
          <p className="text-gray-700">
            Em caso de dúvidas ou questões relacionadas a estes Termos de Uso, entre em contato pelo e-mail: termos@votocerto.com.br
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms;
