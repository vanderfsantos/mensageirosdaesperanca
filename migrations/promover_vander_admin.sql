-- =========================================================================
-- PROMOVER USUÁRIO vander@gmail.com A ADMINISTRADOR GERAL
-- =========================================================================

-- 1. Atualizar o profile na tabela public.profiles para 'admin' e status 'active'
UPDATE public.profiles
SET 
    role = 'admin',
    status = 'active',
    cargo = COALESCE(cargo, 'Diretoria / Administrador Geral')
WHERE lower(email) = 'vander@gmail.com';

-- 2. Caso o registro ainda não conste em public.profiles mas exista no auth.users
INSERT INTO public.profiles (id, full_name, email, cargo, role, status)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'full_name', 'Vander Freitas'),
    email,
    'Diretoria / Administrador Geral',
    'admin',
    'active'
FROM auth.users
WHERE lower(email) = 'vander@gmail.com'
ON CONFLICT (id) DO UPDATE
SET 
    role = 'admin',
    status = 'active',
    cargo = 'Diretoria / Administrador Geral';
