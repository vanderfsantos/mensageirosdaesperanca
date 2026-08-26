-- =========================================================================
-- MIGRATION 002: Sistema de Aprovação de Novos Operadores e Profiles
-- =========================================================================

-- 1. Adicionar ou atualizar a coluna cargo e status na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cargo TEXT;

-- Remover constraint antiga de status se existir
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_status_check;

-- Atualizar status padrão e adicionar constraint com novos status
ALTER TABLE public.profiles 
ALTER COLUMN status SET DEFAULT 'pending';

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_status_check 
CHECK (status IN ('pending', 'active', 'rejected', 'blocked', 'ativo', 'convidado', 'inativo'));

-- 2. Migrar usuários antigos 'ativo' para 'active' se desejado
UPDATE public.profiles 
SET status = 'active' 
WHERE status = 'ativo';

-- 3. Atualizar a trigger para que novos cadastros nasçam com status = 'pending'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    user_role text;
BEGIN
    user_role := lower(coalesce(new.raw_user_meta_data->>'role', 'editor'));
    IF user_role NOT IN ('admin', 'editor', 'comunicacao') THEN
        user_role := 'editor';
    END IF;

    INSERT INTO public.profiles (id, full_name, email, cargo, role, status)
    VALUES (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', 'Administrador'),
        new.email,
        coalesce(new.raw_user_meta_data->>'cargo', 'Administrador'),
        user_role,
        'pending'
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        cargo = EXCLUDED.cargo;
        
    RETURN new;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'handle_new_user warning: %', SQLERRM;
        RETURN new;
END;
$$;
