-- Adicionar coluna faltante na tabela properties
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS tipo_unidade VARCHAR;

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Criar enums para melhor estruturação dos dados
CREATE TYPE IF NOT EXISTS user_role_enum AS ENUM ('admin', 'gestor_prf', 'servidor_prf', 'empresa');

-- Atualizar tabela users para usar enum
ALTER TABLE public.users ALTER COLUMN role TYPE user_role_enum USING role::user_role_enum;

-- Criar políticas RLS para properties (todos podem visualizar, apenas admins/gestores podem modificar)
CREATE POLICY "Todos podem visualizar imóveis" 
ON public.properties 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Apenas admins e gestores podem modificar imóveis" 
ON public.properties 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid()::integer 
    AND users.role IN ('admin', 'gestor_prf')
  )
);

-- Criar políticas RLS para companies
CREATE POLICY "Todos podem visualizar empresas" 
ON public.companies 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Apenas admins podem modificar empresas" 
ON public.companies 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid()::integer 
    AND users.role = 'admin'
  )
);

-- Criar políticas RLS para maintenance_requests
CREATE POLICY "Todos podem visualizar solicitações de manutenção" 
ON public.maintenance_requests 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "PRF pode criar solicitações" 
ON public.maintenance_requests 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid()::integer 
    AND users.role IN ('admin', 'gestor_prf', 'servidor_prf')
  )
);

CREATE POLICY "PRF e empresas podem atualizar solicitações" 
ON public.maintenance_requests 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid()::integer 
    AND users.role IN ('admin', 'gestor_prf', 'servidor_prf', 'empresa')
  )
);

-- Criar políticas RLS para users (apenas admins podem gerenciar usuários)
CREATE POLICY "Usuários podem ver próprio perfil" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (id = auth.uid()::integer);

CREATE POLICY "Apenas admins podem modificar usuários" 
ON public.users 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid()::integer 
    AND users.role = 'admin'
  )
);

-- Adicionar foreign keys que podem estar faltando
ALTER TABLE public.maintenance_requests 
ADD CONSTRAINT fk_maintenance_requests_property 
FOREIGN KEY (property_id) REFERENCES public.properties(id_caip);

ALTER TABLE public.maintenance_requests 
ADD CONSTRAINT fk_maintenance_requests_company 
FOREIGN KEY (company_id) REFERENCES public.companies(id);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_properties_unidade_gestora ON public.properties(unidade_gestora);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON public.maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_property ON public.maintenance_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_company ON public.maintenance_requests(company_id);