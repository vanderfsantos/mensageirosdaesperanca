-- Schema inicial para a base de dados do Supabase (OSC Mensageiros da Esperança)

-- 1. Tabela de Cursos e Eventos
CREATE TABLE IF NOT EXISTS courses_events (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT,
    location TEXT NOT NULL,
    location_name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('capacitacao', 'socioeducativo', 'comunidade', 'evento')),
    status TEXT NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'completed')),
    status_text TEXT NOT NULL CHECK (status_text IN ('inscricoes-abertas', 'lista-espera', 'encerrado')),
    spots_total INTEGER,
    spots_left INTEGER,
    workload TEXT NOT NULL,
    modality TEXT NOT NULL CHECK (modality IN ('presencial', 'online')),
    shift TEXT NOT NULL CHECK (shift IN ('manha', 'tarde', 'noite', 'sabado')),
    syllabus TEXT[] NOT NULL,
    registration_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Notícias
CREATE TABLE IF NOT EXISTS news_posts (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    author TEXT NOT NULL,
    read_time TEXT,
    featured BOOLEAN DEFAULT FALSE,
    published_status TEXT NOT NULL DEFAULT 'publicado' CHECK (published_status IN ('publicado', 'rascunho')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Histórias de Transformação
CREATE TABLE IF NOT EXISTS impact_stories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    role TEXT NOT NULL CHECK (role IN ('participante', 'empreendedor', 'voluntario', 'parceiro')),
    project TEXT NOT NULL,
    quote TEXT NOT NULL,
    story TEXT NOT NULL,
    image_url TEXT NOT NULL,
    video_url TEXT,
    lgpd_consent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Documentos de Transparência (Portal de Contas)
CREATE TABLE IF NOT EXISTS transparency_documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('institucional', 'governanca', 'atividades', 'contas', 'mrosc', 'politicas')),
    status TEXT NOT NULL CHECK (status IN ('disponivel', 'atualizacao')),
    file_url TEXT NOT NULL,
    file_size TEXT NOT NULL DEFAULT '—',
    file_type TEXT NOT NULL DEFAULT 'PDF',
    publish_date TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de Equipe Técnica / Governança
CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    mandate TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    image_url TEXT NOT NULL,
    bio TEXT,
    linkedin_url TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela de Mensagens de Contato / Canal de Escuta
CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'respondido', 'arquivado')),
    is_anonymous BOOLEAN DEFAULT FALSE,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 7. Tabela de Perfis de Usuários Administradores
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'comunicacao')),
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'convidado', 'inativo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para perfis
CREATE POLICY "Usuários autenticados podem visualizar perfis"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Usuários autenticados podem atualizar seus próprios perfis ou admins gerenciarem"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Admins podem inserir ou deletar perfis"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Trigger para criar perfil automaticamente ao cadastrar em auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role, status)
    VALUES (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', 'Administrador'),
        new.email,
        coalesce(new.raw_user_meta_data->>'role', 'editor'),
        'ativo'
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        role = EXCLUDED.role;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

