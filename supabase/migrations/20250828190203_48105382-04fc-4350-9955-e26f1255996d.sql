-- CORREÇÃO DE SEGURANÇA CRÍTICA: Políticas RLS para tabela users (versão segura)
-- Remove políticas permissivas existentes e cria políticas seguras

-- Remover políticas existentes perigosas
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.users;
DROP POLICY IF EXISTS "Usuários podem ver próprio perfil" ON public.users;
DROP POLICY IF EXISTS "Apenas admins podem modificar usuários" ON public.users;

-- Remover função anterior que estava causando erro
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- POLÍTICA ULTRA SEGURA: Usuários só podem ver seus PRÓPRIOS dados
CREATE POLICY "users_select_own_data_only" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (auth_user_id = auth.uid());

-- POLÍTICA SEGURA: Apenas o próprio usuário pode inserir seus dados
CREATE POLICY "users_insert_own_data_only" 
ON public.users 
FOR INSERT 
TO authenticated 
WITH CHECK (auth_user_id = auth.uid());

-- POLÍTICA SEGURA: Apenas o próprio usuário pode atualizar seus dados
CREATE POLICY "users_update_own_data_only" 
ON public.users 
FOR UPDATE 
TO authenticated 
USING (auth_user_id = auth.uid()) 
WITH CHECK (auth_user_id = auth.uid());

-- POLÍTICA SEGURA: Ninguém pode deletar usuários via API pública
-- (Deleções devem ser feitas via dashboard Supabase por administradores)
CREATE POLICY "users_delete_disabled" 
ON public.users 
FOR DELETE 
TO authenticated 
USING (false);

-- Garantir que a coluna auth_user_id não seja nula (crítico para segurança)
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