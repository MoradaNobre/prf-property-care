import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Building2, 
  Filter, 
  Download,
  Eye,
  Wrench
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id_caip: number;
  unidade_gestora: string;
  nome_unidade: string;
  endereco: string;
  tipo_imovel: string;
  situacao: string;
  estado_conservacao?: string;
  area_construida_m2?: number;
  coordenadas?: string;
}

function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    // Filter properties based on search term
    const filtered = properties.filter(property =>
      property.nome_unidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.unidade_gestora?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.endereco?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProperties(filtered);
  }, [properties, searchTerm]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('nome_unidade');

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Erro ao carregar imóveis",
        description: "Não foi possível carregar a lista de imóveis.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'em uso':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'desativado':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'em reforma':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getConservationColor = (conservation: string) => {
    switch (conservation?.toLowerCase()) {
      case 'bom':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'regular':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'ruim':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-8 rounded-lg text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Carregando imóveis...</p>
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
              Gestão de Imóveis
            </h1>
            <p className="text-white/80 mt-2">
              Gerenciar e monitorar todos os imóveis da Polícia Rodoviária Federal
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="hover-lift">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" className="hover-lift">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-white/60" />
            <Input
              placeholder="Buscar por nome, unidade ou endereço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>
        </div>

        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{properties.length}</div>
            <div className="text-white/80 text-sm">Total de Imóveis</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary">
              {properties.filter(p => p.situacao?.toLowerCase() === 'em uso').length}
            </div>
            <div className="text-white/80 text-sm">Em Uso</div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id_caip} className="glass-card border-white/20 hover-lift">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-white text-lg leading-tight">
                  {property.nome_unidade}
                </CardTitle>
                <Badge className={`text-xs ${getStatusColor(property.situacao || '')}`}>
                  {property.situacao || 'N/A'}
                </Badge>
              </div>
              <p className="text-white/80 text-sm">{property.unidade_gestora}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-white/60 mt-0.5" />
                  <p className="text-white/80 text-sm leading-relaxed">
                    {property.endereco}
                  </p>
                </div>
                
                {property.tipo_imovel && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-white/60" />
                    <p className="text-white/80 text-sm">{property.tipo_imovel}</p>
                  </div>
                )}

                {property.area_construida_m2 && (
                  <div className="text-white/80 text-sm">
                    Área: {property.area_construida_m2.toLocaleString('pt-BR')} m²
                  </div>
                )}

                {property.estado_conservacao && (
                  <Badge className={`text-xs ${getConservationColor(property.estado_conservacao)}`}>
                    {property.estado_conservacao}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1 hover-lift">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver Detalhes
                </Button>
                <Button size="sm" className="flex-1 bg-secondary hover:bg-secondary/90 hover-lift">
                  <Wrench className="w-4 h-4 mr-1" />
                  Manutenção
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && !loading && (
        <Card className="glass-card border-white/20 p-12 text-center">
          <Building2 className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">Nenhum imóvel encontrado</h3>
          <p className="text-white/80">
            {searchTerm 
              ? 'Tente ajustar os termos de busca ou limpar os filtros.'
              : 'Nenhum imóvel cadastrado no sistema.'}
          </p>
        </Card>
      )}
    </div>
  );
}

export default Properties;