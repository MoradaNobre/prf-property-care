-- Adicionar coluna faltante na tabela properties
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS tipo_unidade VARCHAR;

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Criar enum para roles de usuário (só se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM ('admin', 'gestor_prf', 'servidor_prf', 'empresa');
    END IF;
END $$;

-- Adicionar coluna auth_user_id à tabela users para mapear com auth.users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

-- Atualizar tabela users para usar enum
ALTER TABLE public.users ALTER COLUMN role TYPE user_role_enum USING role::user_role_enum;

-- Criar função de segurança para verificar role do usuário
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role_enum AS $$
  SELECT role FROM public.users WHERE auth_user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Criar políticas RLS para properties (todos podem ver, apenas gestores podem editar)
CREATE POLICY "Todos podem visualizar imóveis" 
ON public.properties 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Apenas admins e gestores podem modificar imóveis" 
ON public.properties 
FOR INSERT, UPDATE, DELETE 
TO authenticated 
USING (public.get_current_user_role() IN ('admin', 'gestor_prf'));

-- Criar políticas RLS para companies
CREATE POLICY "Todos podem visualizar empresas" 
ON public.companies 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Apenas admins podem modificar empresas" 
ON public.companies 
FOR INSERT, UPDATE, DELETE 
TO authenticated 
USING (public.get_current_user_role() = 'admin');

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
WITH CHECK (public.get_current_user_role() IN ('admin', 'gestor_prf', 'servidor_prf'));

CREATE POLICY "PRF e empresas podem atualizar solicitações" 
ON public.maintenance_requests 
FOR UPDATE 
TO authenticated 
USING (public.get_current_user_role() IN ('admin', 'gestor_prf', 'servidor_prf', 'empresa'));

-- Criar políticas RLS para users
CREATE POLICY "Usuários podem ver próprio perfil" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (auth_user_id = auth.uid());

CREATE POLICY "Apenas admins podem modificar usuários" 
ON public.users 
FOR INSERT, UPDATE, DELETE 
TO authenticated 
USING (public.get_current_user_role() = 'admin');

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_properties_unidade_gestora ON public.properties(unidade_gestora);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON public.maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_property ON public.maintenance_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_company ON public.maintenance_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON public.users(auth_user_id);