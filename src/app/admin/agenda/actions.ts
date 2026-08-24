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
 * Server Action: Salvar ou criar um novo curso.
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
  workload: string; // Ex: "40 horas"
  modality: 'presencial' | 'online';
  shift: 'manha' | 'tarde' | 'noite' | 'sabado';
  syllabus: string[];
  registrationLink?: string;
}) {
  const isMockMode = !hasSupabase();

  if (isMockMode) {
    // Modo de Simulação (Mutação local na memória)
    const existingIndex = data.id ? courseEvents.findIndex(c => c.id === data.id) : -1;

    const courseToSave: CourseEvent = {
      id: data.id || `mock-course-${Date.now()}`,
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
      spotsTotal: data.spotsTotal ?? undefined,
      spotsLeft: data.spotsLeft ?? undefined,
      workload: data.workload,
      modality: data.modality,
      shift: data.shift,
      syllabus: data.syllabus,
      registrationLink: data.registrationLink || undefined,
    };

    if (existingIndex > -1) {
      courseEvents[existingIndex] = courseToSave;
    } else {
      courseEvents.push(courseToSave);
    }
  } else {
    // Persistência Real no Supabase
    try {
      const supabase = await createClient();
      const payload = {
        id: data.id || undefined,
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

      const { error } = await supabase
        .from('courses_events')
        .upsert(payload);

      if (error) throw error;
    } catch (err) {
      console.error('Server Actions: Falha ao persistir curso no Supabase', err);
      throw new Error('Falha ao persistir dados do curso no banco de dados.');
    }
  }

  // Revalida o cache
  revalidatePath('/agenda');
  revalidatePath(`/agenda/${data.slug}`);
  revalidatePath('/admin/agenda');
}

/**
 * Server Action: Excluir um curso pelo ID.
 */
export async function deleteCourseAction(id: string) {
  const isMockMode = !hasSupabase();

  if (isMockMode) {
    // Modo de Simulação (Mutação local na memória)
    const index = courseEvents.findIndex(c => c.id === id);
    if (index > -1) {
      courseEvents.splice(index, 1);
    }
  } else {
    // Persistência Real no Supabase
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('courses_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Server Actions: Falha ao deletar curso no Supabase', err);
      throw new Error('Falha ao remover o curso do banco de dados.');
    }
  }

  // Revalida o cache
  revalidatePath('/agenda');
  revalidatePath('/admin/agenda');
}

/**
 * Server Action: Alterar rapidamente o status e o texto de status de um curso.
 */
export async function toggleStatusAction(
  id: string, 
  status: 'upcoming' | 'ongoing' | 'completed', 
  statusText: 'inscricoes-abertas' | 'lista-espera' | 'encerrado'
) {
  const isMockMode = !hasSupabase();

  if (isMockMode) {
    // Modo de Simulação (Mutação local na memória)
    const course = courseEvents.find(c => c.id === id);
    if (course) {
      course.status = status;
      course.statusText = statusText;
    }
  } else {
    // Persistência Real no Supabase
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('courses_events')
        .update({ status, status_text: statusText })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Server Actions: Falha ao alterar status de curso no Supabase', err);
      throw new Error('Falha ao atualizar o status do curso.');
    }
  }

  // Revalida o cache
  revalidatePath('/agenda');
  revalidatePath('/admin/agenda');
}
