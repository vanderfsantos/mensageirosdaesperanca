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
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  date: string;
  author: string;
  readTime?: string;
}

export interface ImpactStory {
  id: string;
  name: string;
  age?: number;
  role: 'participante' | 'empreendedor' | 'voluntario' | 'parceiro';
  story: string;
  quote: string;
  imageUrl: string;
  project: string;
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
  imageUrl: string;
  bio?: string;
  linkedinUrl?: string;
  email?: string;
}
