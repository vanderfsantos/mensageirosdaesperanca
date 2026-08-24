import React from 'react';
import { getCoursesEvents } from '@/lib/supabaseClient';
import AgendaClient from '@/components/agenda/AgendaClient';

export const metadata = {
  title: 'Agenda de Cursos e Oficinas | Mensageiros da Esperança',
  description: 'Confira as próximas oficinas e cursos gratuitos de capacitação profissional e desenvolvimento comunitário.',
};

export default async function AgendaPage() {
  const events = await getCoursesEvents();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      {/* Banner Principal */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight">Agenda de Oportunidades</h1>
          <p className="text-primary-light mt-2 text-lg font-light max-w-xl">
            Inscreva-se em nossas oficinas gratuitas de capacitação profissional e desenvolvimento pessoal.
          </p>
        </div>
      </section>

      {/* Seção Filtros & Listagem Conectada ao Supabase */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full sm:px-6 lg:px-8 flex-grow">
        <AgendaClient initialEvents={events} />
      </section>
    </div>
  );
}
