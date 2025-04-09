
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Save } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState({
    siteTitle: 'Voto Certo',
    siteDescription: 'Plataforma de pesquisas eleitorais',
    contactEmail: currentUser?.email || '',
    enablePublicRegistration: true
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    notifyOnNewVote: true,
    notifyOnPollEnd: true,
    dailySummary: false
  });
  
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToggleChange = (name: string, checked: boolean, isGeneral = true) => {
    if (isGeneral) {
      setGeneralSettings(prev => ({ ...prev, [name]: checked }));
    } else {
      setNotificationSettings(prev => ({ ...prev, [name]: checked }));
    }
  };
  
  const saveSettings = (settingsType: string) => {
    setLoading(true);
    
    // Simulated save operation
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Configurações salvas",
        description: `As configurações de ${settingsType === 'general' ? 'gerais' : 'notificação'} foram salvas com sucesso.`,
      });
    }, 1000);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema e suas preferências.
          </p>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Configurações básicas do sistema de pesquisas eleitorais.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteTitle">Título do Site</Label>
                  <Input
                    id="siteTitle"
                    name="siteTitle"
                    value={generalSettings.siteTitle}
                    onChange={handleGeneralChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Descrição</Label>
                  <Input
                    id="siteDescription"
                    name="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={handleGeneralChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de Contato</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralChange}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enablePublicRegistration">Permitir Registro Público</Label>
                    <p className="text-sm text-muted-foreground">
                      Habilitar o registro de novos usuários no sistema.
                    </p>
                  </div>
                  <Switch
                    id="enablePublicRegistration"
                    checked={generalSettings.enablePublicRegistration}
                    onCheckedChange={(checked) => handleToggleChange('enablePublicRegistration', checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => saveSettings('general')} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Configurações
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <CardDescription>
                  Gerencie como e quando receber notificações do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações por email.
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleToggleChange('emailNotifications', checked, false)}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnNewVote">Notificar sobre Novos Votos</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificação quando houver novos votos em pesquisas.
                    </p>
                  </div>
                  <Switch
                    id="notifyOnNewVote"
                    checked={notificationSettings.notifyOnNewVote}
                    onCheckedChange={(checked) => handleToggleChange('notifyOnNewVote', checked, false)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnPollEnd">Notificar Término de Pesquisas</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificação quando uma pesquisa for encerrada.
                    </p>
                  </div>
                  <Switch
                    id="notifyOnPollEnd"
                    checked={notificationSettings.notifyOnPollEnd}
                    onCheckedChange={(checked) => handleToggleChange('notifyOnPollEnd', checked, false)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dailySummary">Resumo Diário</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber um resumo diário com todas as atividades.
                    </p>
                  </div>
                  <Switch
                    id="dailySummary"
                    checked={notificationSettings.dailySummary}
                    onCheckedChange={(checked) => handleToggleChange('dailySummary', checked, false)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => saveSettings('notifications')} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Configurações
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Segurança</CardTitle>
                <CardDescription>
                  Gerencie as configurações de segurança do seu sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Digite sua senha atual"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Digite a nova senha"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme a nova senha"
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Sessões Ativas</h3>
                  <p className="text-sm text-muted-foreground">
                    Nenhuma outra sessão ativa encontrada.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Atualizar Senha</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
