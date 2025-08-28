import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Plus, 
  Calendar, 
  Building2, 
  Filter, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MaintenanceRequest {
  id: number;
  description: string;
  status: string;
  request_date: string;
  completion_date?: string;
  cost?: number;
  property_id: number;
  company_id?: number;
  properties?: {
    nome_unidade: string;
    unidade_gestora: string;
  };
  companies?: {
    name: string;
  };
}

export default function Maintenance() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const fetchMaintenanceRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          properties (nome_unidade, unidade_gestora),
          companies (name)
        `)
        .order('request_date', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      toast({
        title: "Erro ao carregar manutenções",
        description: "Não foi possível carregar as solicitações de manutenção.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'solicitado':
        return <Clock className="w-4 h-4" />;
      case 'em_andamento':
        return <AlertCircle className="w-4 h-4" />;
      case 'concluido':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'solicitado':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'em_andamento':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'concluido':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'solicitado':
        return 'Solicitado';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluido':
        return 'Concluído';
      default:
        return status;
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'solicitado').length,
    inProgress: requests.filter(r => r.status === 'em_andamento').length,
    completed: requests.filter(r => r.status === 'concluido').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-8 rounded-lg text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Carregando manutenções...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Wrench className="w-8 h-8" />
              Gestão de Manutenção
            </h1>
            <p className="text-white/80 mt-2">
              Controle e acompanhamento de todas as solicitações de manutenção
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="hover-lift">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground hover-lift">
              <Plus className="w-4 h-4 mr-2" />
              Nova Solicitação
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-white/80 text-sm">Total</div>
              </div>
              <Wrench className="w-8 h-8 text-white/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-300">{stats.pending}</div>
                <div className="text-white/80 text-sm">Pendentes</div>
              </div>
              <Clock className="w-8 h-8 text-yellow-300/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-300">{stats.inProgress}</div>
                <div className="text-white/80 text-sm">Em Andamento</div>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-300/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-300">{stats.completed}</div>
                <div className="text-white/80 text-sm">Concluídas</div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-300/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Requests */}
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="glass-card border-white/20 hover-lift">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-white text-lg">
                      #{request.id.toString().padStart(4, '0')}
                    </CardTitle>
                    <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        {getStatusText(request.status)}
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Building2 className="w-4 h-4" />
                    <span>{request.properties?.nome_unidade}</span>
                    <span>•</span>
                    <span>{request.properties?.unidade_gestora}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(request.request_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                  {request.cost && (
                    <div className="text-secondary font-semibold mt-1">
                      {new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(Number(request.cost))}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-white/90 mb-4">
                {request.description}
              </p>

              {request.companies && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-white/60 text-sm">Empresa:</span>
                  <Badge variant="outline" className="text-white/80">
                    {request.companies.name}
                  </Badge>
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="hover-lift">
                  Ver Detalhes
                </Button>
                {request.status !== 'concluido' && (
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90 hover-lift">
                    Atualizar Status
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <Card className="glass-card border-white/20 p-12 text-center">
          <Wrench className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">Nenhuma manutenção encontrada</h3>
          <p className="text-white/80 mb-6">
            Não há solicitações de manutenção cadastradas no sistema.
          </p>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground hover-lift">
            <Plus className="w-4 h-4 mr-2" />
            Criar Nova Solicitação
          </Button>
        </Card>
      )}
    </div>
  );
}