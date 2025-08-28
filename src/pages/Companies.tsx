import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Users, 
  Plus, 
  Phone, 
  Mail, 
  Contact,
  Building2,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Company {
  id: number;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  created_at: string;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    // Filter companies based on search term
    const filtered = companies.filter(company =>
      company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [companies, searchTerm]);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Erro ao carregar empresas",
        description: "Não foi possível carregar a lista de empresas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-8 rounded-lg text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Carregando empresas...</p>
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
              <Building2 className="w-8 h-8" />
              Empresas Terceirizadas
            </h1>
            <p className="text-white/80 mt-2">
              Gerenciar empresas prestadoras de serviços de manutenção
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="hover-lift">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground hover-lift">
              <Plus className="w-4 h-4 mr-2" />
              Nova Empresa
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-white/60" />
            <Input
              placeholder="Buscar por nome, responsável ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
        </div>

        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{companies.length}</div>
                <div className="text-white/80 text-sm">Total de Empresas</div>
              </div>
              <Users className="w-8 h-8 text-white/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="glass-card border-white/20 hover-lift">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg leading-tight">
                    {company.name}
                  </CardTitle>
                  {company.contact_person && (
                    <div className="flex items-center gap-2 mt-2">
                      <Contact className="w-4 h-4 text-white/60" />
                      <span className="text-white/80 text-sm">{company.contact_person}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                {company.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-white/60" />
                    <a 
                      href={`mailto:${company.email}`}
                      className="text-secondary hover:text-secondary/80 text-sm transition-colors"
                    >
                      {company.email}
                    </a>
                  </div>
                )}

                {company.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-white/60" />
                    <a 
                      href={`tel:${company.phone}`}
                      className="text-secondary hover:text-secondary/80 text-sm transition-colors"
                    >
                      {company.phone}
                    </a>
                  </div>
                )}

                {!company.email && !company.phone && (
                  <div className="text-white/60 text-sm italic">
                    Nenhuma informação de contato disponível
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 hover-lift">
                  Ver Detalhes
                </Button>
                <Button size="sm" className="flex-1 bg-secondary hover:bg-secondary/90 hover-lift">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && !loading && (
        <Card className="glass-card border-white/20 p-12 text-center">
          <Building2 className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">
            {searchTerm ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa cadastrada'}
          </h3>
          <p className="text-white/80 mb-6">
            {searchTerm 
              ? 'Tente ajustar os termos de busca ou limpar os filtros.'
              : 'Comece cadastrando a primeira empresa terceirizada no sistema.'}
          </p>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground hover-lift">
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Empresa
          </Button>
        </Card>
      )}
    </div>
  );
}