import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { courseEvents } from '@/lib/mock-data';
import { CourseEvent } from '@/types';
import CourseForm from '@/components/admin/CourseForm';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Editar Curso | Painel Mensageiros da Esperança',
  description: 'Modificar informações de curso ou oficina cadastrados.',
};

export default async function AdminEditCoursePage({ params }: EditPageProps) {
  const { id } = await params;
  let course: CourseEvent | null = null;

  const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!hasSupabase) {
    // Busca do Mock local
    course = courseEvents.find(c => c.id === id) || null;
  } else {
    // Busca do Supabase
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('courses_events')
        .select('*')
        .eq('id', id)
        .single();

      if (data && !error) {
        course = {
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
      } else {
        // Fallback local caso o registro específico não exista no banco mas possa existir no mock
        course = courseEvents.find(c => c.id === id) || null;
      }
    } catch (err) {
      console.warn(`Admin Edit: Falha ao obter curso ID ${id} no Supabase, usando mock local.`, err);
      course = courseEvents.find(c => c.id === id) || null;
    }
  }

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <CourseForm initialData={course} />
    </div>
  );
}
