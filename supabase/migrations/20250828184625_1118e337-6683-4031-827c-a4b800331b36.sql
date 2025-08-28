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

-- Criar políticas básicas e permissivas para começar (depois podemos refinar)
CREATE POLICY "Enable read access for all authenticated users" 
ON public.properties FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for all authenticated users" 
ON public.companies FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for all authenticated users" 
ON public.maintenance_requests FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for all authenticated users" 
ON public.users FOR SELECT TO authenticated USING (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_properties_unidade_gestora ON public.properties(unidade_gestora);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_status ON public.maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_property ON public.maintenance_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_company ON public.maintenance_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON public.users(auth_user_id);