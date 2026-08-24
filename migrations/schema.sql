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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Histórias de Transformação
CREATE TABLE IF NOT EXISTS impact_stories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    role TEXT NOT NULL CHECK (role IN ('participante', 'empreendedor', 'voluntario', 'parceiro')),
    story TEXT NOT NULL,
    quote TEXT NOT NULL,
    image_url TEXT NOT NULL,
    project TEXT NOT NULL,
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
    file_size TEXT NOT NULL,
    file_type TEXT NOT NULL,
    publish_date TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de Equipe Técnica / Governança
CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    image_url TEXT NOT NULL,
    bio TEXT,
    linkedin_url TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
