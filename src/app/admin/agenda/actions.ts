'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { courseEvents } from '@/lib/mock-data';
import { CourseEvent } from '@/types';

// Determina se as credenciais do Supabase estão configuradas
const hasSupabase = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

/**
 * Server Action: Salvar ou criar um novo curso/evento.
 */
export async function saveCourseAction(data: {
  id?: string;
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
  spotsTotal?: number;
  spotsLeft?: number;
  workload: string;
  modality: 'presencial' | 'online';
  shift: 'manha' | 'tarde' | 'noite' | 'sabado';
  syllabus: string[];
  registrationLink?: string;
}) {
  const finalId = data.id && data.id.trim() !== '' ? data.id : `course-${Date.now()}`;

  const courseToSave: CourseEvent = {
    id: finalId,
    slug: data.slug,
    title: data.title,
    description: data.description,
    date: data.date,
    time: data.time || undefined,
    location: data.location,
    locationName: data.locationName,
    imageUrl: data.imageUrl,
    category: data.category,
    status: data.status,
    statusText: data.statusText,
    spotsTotal: data.spotsTotal !== undefined ? Number(data.spotsTotal) : undefined,
    spotsLeft: data.spotsLeft !== undefined ? Number(data.spotsLeft) : undefined,
    workload: data.workload,
    modality: data.modality,
    shift: data.shift,
    syllabus: data.syllabus,
    registrationLink: data.registrationLink || undefined,
  };

  // Sempre sincroniza o mock-data local na memória para consistência imediata
  const existingIndex = courseEvents.findIndex((c) => c.id === finalId || c.slug === data.slug);
  if (existingIndex > -1) {
    courseEvents[existingIndex] = courseToSave;
  } else {
    courseEvents.unshift(courseToSave);
  }

  // Tenta persistir no Supabase se configurado
  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const payload = {
        id: finalId,
        slug: data.slug,
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time || null,
        location: data.location,
        location_name: data.locationName,
        image_url: data.imageUrl,
        category: data.category,
        status: data.status,
        status_text: data.statusText,
        spots_total: data.spotsTotal !== undefined ? Number(data.spotsTotal) : null,
        spots_left: data.spotsLeft !== undefined ? Number(data.spotsLeft) : null,
        workload: data.workload,
        modality: data.modality,
        shift: data.shift,
        syllabus: data.syllabus,
        registration_link: data.registrationLink || null,
      };

      const { error } = await supabase.from('courses_events').upsert(payload, {
        onConflict: 'id',
      });

      if (error) {
        console.warn('saveCourseAction: Aviso ao persistir no Supabase (mantido em memória):', error.message);
      }
    } catch (err) {
      console.warn('saveCourseAction: Erro de conexão Supabase (mantido em memória):', err);
    }
  }

  // Revalida o cache
  revalidatePath('/agenda');
  revalidatePath(`/agenda/${data.slug}`);
  revalidatePath('/admin/agenda');
  revalidatePath('/admin');
  revalidatePath('/');

  return { success: true, id: finalId };
}

/**
 * Server Action: Excluir um curso pelo ID.
 */
export async function deleteCourseAction(id: string) {
  // Remove do mock data
  const index = courseEvents.findIndex((c) => c.id === id);
  if (index > -1) {
    courseEvents.splice(index, 1);
  }

  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('courses_events').delete().eq('id', id);
      if (error) {
        console.warn('deleteCourseAction: Aviso ao deletar no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('deleteCourseAction: Erro ao deletar no Supabase:', err);
    }
  }

  revalidatePath('/agenda');
  revalidatePath('/admin/agenda');
  revalidatePath('/admin');
  revalidatePath('/');

  return { success: true };
}

/**
 * Server Action: Alterar rapidamente o status de um curso.
 */
export async function toggleStatusAction(
  id: string,
  status: 'upcoming' | 'ongoing' | 'completed',
  statusText: 'inscricoes-abertas' | 'lista-espera' | 'encerrado'
) {
  const course = courseEvents.find((c) => c.id === id);
  if (course) {
    course.status = status;
    course.statusText = statusText;
  }

  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('courses_events')
        .update({ status, status_text: statusText })
        .eq('id', id);

      if (error) {
        console.warn('toggleStatusAction: Aviso ao atualizar status no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('toggleStatusAction: Erro no Supabase:', err);
    }
  }

  revalidatePath('/agenda');
  revalidatePath('/admin/agenda');

  return { success: true };
}
