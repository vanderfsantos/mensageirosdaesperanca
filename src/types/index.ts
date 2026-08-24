export interface CourseEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  locationName: string;
  imageUrl: string;
  category: 'capacitacao' | 'socioeducativo' | 'comunidade' | 'evento';
  status: 'upcoming' | 'ongoing' | 'completed';
  statusText: 'inscricoes-abertas' | 'lista-espera' | 'encerrado';
  registrationLink?: string;
  spotsTotal?: number;
  spotsLeft?: number;
  workload: string;
  modality: 'presencial' | 'online';
  shift: 'manha' | 'tarde' | 'noite' | 'sabado';
  syllabus: string[];
}

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: 'Cursos' | 'Eventos e Campanhas' | 'Parcerias' | 'Impacto' | 'Artigos' | 'Imprensa';
  date: string;
  author: string;
  readTime?: string;
  featured?: boolean;
  publishedStatus: 'publicado' | 'rascunho';
}

export interface ImpactStory {
  id: string;
  name: string;
  age?: number;
  role: 'participante' | 'empreendedor' | 'voluntario' | 'parceiro';
  project: string;
  quote: string;
  story: string;
  imageUrl: string;
  videoUrl?: string;
  lgpdConsent: boolean;
}


export interface TransparencyDoc {
  id: string;
  title: string;
  year: number;
  category: 'institucional' | 'governanca' | 'atividades' | 'contas' | 'mrosc' | 'politicas';
  status: 'disponivel' | 'atualizacao';
  fileUrl: string;
  fileSize: string;
  fileType: string;
  publishDate: string;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  category: 'financeiro' | 'apoio' | 'parceiro';
  websiteUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  mandate?: string;
  displayOrder: number;
  imageUrl: string;
  bio?: string;
  linkedinUrl?: string;
  email?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pendente' | 'respondido' | 'arquivado';
  isAnonymous?: boolean;
  receivedAt: string;
  resolvedAt?: string;
}
