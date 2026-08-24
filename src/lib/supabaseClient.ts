import { createClient } from '@supabase/supabase-js';
import * as mockData from './mock-data';
import { CourseEvent, NewsPost, ImpactStory, TransparencyDoc, TeamMember } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Inicialização segura do cliente Supabase
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Busca todos os cursos e eventos ativos.
 * Fallback automático para mock-data local.
 */
export async function getCoursesEvents(): Promise<CourseEvent[]> {
  if (!supabase) return mockData.courseEvents;
  try {
    const { data, error } = await supabase
      .from('courses_events')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) throw error || new Error('Nenhum dado retornado.');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      description: item.description,
      date: item.date,
      time: item.time || undefined,
      location: item.location,
      locationName: item.location_name,
      imageUrl: item.image_url,
      category: item.category,
      status: item.status,
      statusText: item.status_text,
      spotsTotal: item.spots_total ?? undefined,
      spotsLeft: item.spots_left ?? undefined,
      workload: item.workload,
      modality: item.modality,
      shift: item.shift,
      syllabus: item.syllabus || [],
    }));
  } catch (err) {
    console.warn('Supabase: Falha ao obter cursos_events, usando mock-data local.', err);
    return mockData.courseEvents;
  }
}

/**
 * Busca um curso específico pelo slug.
 */
export async function getCourseEventBySlug(slug: string): Promise<CourseEvent | null> {
  if (!supabase) {
    return mockData.courseEvents.find(e => e.slug === slug) || null;
  }
  try {
    const { data, error } = await supabase
      .from('courses_events')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) throw error || new Error('Registro não encontrado.');

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      date: data.date,
      time: data.time || undefined,
      location: data.location,
      locationName: data.location_name,
      imageUrl: data.image_url,
      category: data.category,
      status: data.status,
      statusText: data.status_text,
      spotsTotal: data.spots_total ?? undefined,
      spotsLeft: data.spots_left ?? undefined,
      workload: data.workload,
      modality: data.modality,
      shift: data.shift,
      syllabus: data.syllabus || [],
    };
  } catch (err) {
    console.warn(`Supabase: Falha ao obter curso pelo slug ${slug}, usando mock-data local.`, err);
    return mockData.courseEvents.find(e => e.slug === slug) || null;
  }
}

/**
 * Busca todas as publicações de notícias.
 */
export async function getNewsPosts(): Promise<NewsPost[]> {
  if (!supabase) return mockData.newsPosts;
  try {
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) throw error || new Error('Nenhum dado retornado.');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      imageUrl: item.image_url,
      category: item.category,
      date: item.date,
      author: item.author,
      readTime: item.read_time || undefined,
    }));
  } catch (err) {
    console.warn('Supabase: Falha ao obter news_posts, usando mock-data local.', err);
    return mockData.newsPosts;
  }
}

/**
 * Busca uma notícia específica pelo slug.
 */
export async function getNewsPostBySlug(slug: string): Promise<NewsPost | null> {
  if (!supabase) {
    return mockData.newsPosts.find(p => p.slug === slug) || null;
  }
  try {
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) throw error || new Error('Registro não encontrado.');

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      imageUrl: data.image_url,
      category: data.category,
      date: data.date,
      author: data.author,
      readTime: data.read_time || undefined,
    };
  } catch (err) {
    console.warn(`Supabase: Falha ao obter notícia pelo slug ${slug}, usando mock-data local.`, err);
    return mockData.newsPosts.find(p => p.slug === slug) || null;
  }
}

/**
 * Busca as histórias de impacto.
 */
export async function getImpactStories(): Promise<ImpactStory[]> {
  if (!supabase) return mockData.impactStories;
  try {
    const { data, error } = await supabase
      .from('impact_stories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) throw error || new Error('Nenhum dado retornado.');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      age: item.age ?? undefined,
      role: item.role,
      story: item.story,
      quote: item.quote,
      imageUrl: item.image_url,
      project: item.project,
    }));
  } catch (err) {
    console.warn('Supabase: Falha ao obter impact_stories, usando mock-data local.', err);
    return mockData.impactStories;
  }
}

/**
 * Busca documentos do portal de transparência.
 */
export async function getTransparencyDocs(): Promise<TransparencyDoc[]> {
  if (!supabase) return mockData.transparencyDocs;
  try {
    const { data, error } = await supabase
      .from('transparency_documents')
      .select('*')
      .order('year', { ascending: false });

    if (error || !data || data.length === 0) throw error || new Error('Nenhum dado retornado.');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      year: item.year,
      category: item.category,
      status: item.status,
      fileUrl: item.file_url,
      fileSize: item.file_size,
      fileType: item.file_type,
      publishDate: item.publish_date,
    }));
  } catch (err) {
    console.warn('Supabase: Falha ao obter transparency_documents, usando mock-data local.', err);
    return mockData.transparencyDocs;
  }
}

/**
 * Busca a equipe corporativa.
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!supabase) return mockData.teamMembers;
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) throw error || new Error('Nenhum dado retornado.');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      imageUrl: item.image_url,
      bio: item.bio || undefined,
      linkedinUrl: item.linkedin_url || undefined,
      email: item.email || undefined,
    }));
  } catch (err) {
    console.warn('Supabase: Falha ao obter team_members, usando mock-data local.', err);
    return mockData.teamMembers;
  }
}
