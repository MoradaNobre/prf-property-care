import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Building2, 
  Wrench, 
  Users, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const [stats, setStats] = useState({
    properties: 0,
    maintenanceRequests: 0,
    companies: 0,
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [propertiesRes, maintenanceRes, companiesRes] = await Promise.all([
        supabase.from('properties').select('id_caip', { count: 'exact' }),
        supabase.from('maintenance_requests').select('id, status', { count: 'exact' }),
        supabase.from('companies').select('id', { count: 'exact' })
      ]);

      const pendingCount = maintenanceRes.data?.filter(r => r.status === 'solicitado').length || 0;

      setStats({
        properties: propertiesRes.count || 0,
        maintenanceRequests: maintenanceRes.count || 0,
        companies: companiesRes.count || 0,
        pendingRequests: pendingCount
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-8 rounded-lg text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-foreground">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="glass-card p-8 rounded-lg text-center">
        <div className="mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-float">
          <LayoutDashboard className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Sistema de Gestão de Manutenção Predial
        </h1>
        <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
          Controle centralizado da manutenção dos imóveis da Polícia Rodoviária Federal
        </p>
        <Button className="btn-modern text-lg px-8 py-3">
          <Wrench className="w-5 h-5 mr-2" />
          Nova Solicitação de Manutenção
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-border/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-foreground">{stats.properties}</div>
                <div className="text-muted-foreground">Imóveis</div>
              </div>
              <Building2 className="w-12 h-12 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-foreground">{stats.maintenanceRequests}</div>
                <div className="text-muted-foreground">Manutenções</div>
              </div>
              <Wrench className="w-12 h-12 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-foreground">{stats.companies}</div>
                <div className="text-muted-foreground">Empresas</div>
              </div>
              <Users className="w-12 h-12 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/20 hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-accent">{stats.pendingRequests}</div>
                <div className="text-muted-foreground">Pendentes</div>
              </div>
              <Clock className="w-12 h-12 text-accent/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-border/20 hover-lift">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Gestão de Imóveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Visualizar e gerenciar todos os imóveis da PRF</p>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Acessar Imóveis
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/20 hover-lift">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Solicitações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Acompanhar status das manutenções</p>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Ver Manutenções
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/20 hover-lift">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Gerar relatórios e análises</p>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Ver Relatórios
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
