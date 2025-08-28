-- CORREÇÃO DE SEGURANÇA CRÍTICA: Políticas RLS para tabela users
-- Remove políticas permissivas existentes e cria políticas seguras

-- Remover políticas existentes perigosas
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.users;
DROP POLICY IF EXISTS "Usuários podem ver próprio perfil" ON public.users;
DROP POLICY IF EXISTS "Apenas admins podem modificar usuários" ON public.users;

-- Função de segurança melhorada para verificar se é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_user_id = auth.uid() 
    AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Função para verificar se o usuário está acessando seus próprios dados
CREATE OR REPLACE FUNCTION public.is_own_user_data(target_auth_user_id UUID)
RETURNS boolean AS $$
  SELECT target_auth_user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- POLÍTICA SEGURA: Usuários só podem ver seus próprios dados
CREATE POLICY "users_select_own_data" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (
  auth_user_id = auth.uid() 
  OR public.is_admin()
);

-- POLÍTICA SEGURA: Apenas o próprio usuário ou admin pode inserir dados
CREATE POLICY "users_insert_own_data" 
ON public.users 
FOR INSERT 
TO authenticated 
WITH CHECK (
  auth_user_id = auth.uid() 
  OR public.is_admin()
);

-- POLÍTICA SEGURA: Apenas o próprio usuário ou admin pode atualizar dados
CREATE POLICY "users_update_own_data" 
ON public.users 
FOR UPDATE 
TO authenticated 
USING (
  auth_user_id = auth.uid() 
  OR public.is_admin()
) 
WITH CHECK (
  auth_user_id = auth.uid() 
  OR public.is_admin()
);

-- POLÍTICA SEGURA: Apenas admins podem deletar usuários
CREATE POLICY "users_delete_admin_only" 
ON public.users 
FOR DELETE 
TO authenticated 
USING (public.is_admin());

-- Garantir que a coluna auth_user_id não seja nula (importante para segurança)
ALTER TABLE public.users ALTER COLUMN auth_user_id SET NOT NULL;

-- Criar índice único para garantir integridade
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_auth_user_id_unique ON public.users(auth_user_id);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, username, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role_enum, 'servidor_prf'::user_role_enum)
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Se o usuário já existe, apenas retorna NEW
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para automaticamente criar perfil na tabela users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();