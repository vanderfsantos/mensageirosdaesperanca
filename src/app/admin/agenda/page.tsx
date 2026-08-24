import React from 'react';
import { getCoursesEvents } from '@/lib/supabaseClient';
import AgendaCrudList from '@/components/admin/AgendaCrudList';

export const metadata = {
  title: 'Gerenciar Agenda | Painel Mensageiros da Esperança',
  description: 'Controle de oportunidades, cursos, oficinas e status de matrícula.',
};

export default async function AdminAgendaPage() {
  // Busca os cursos de forma assíncrona com fallback resiliente
  const courses = await getCoursesEvents();

  return (
    <div className="space-y-6">
      <AgendaCrudList initialCourses={courses} />
    </div>
  );
}
