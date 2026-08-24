import React from 'react';
import { getImpactStories } from '@/lib/supabaseClient';
import HistoriasClient from '@/components/historias/HistoriasClient';

export const metadata = {
  title: 'Histórias de Impacto | Mensageiros da Esperança',
  description: 'Conheça relatos e depoimentos reais de pessoas que transformaram suas vidas com os projetos da OSC Mensageiros da Esperança.',
};

export default async function HistoriasPage() {
  const stories = await getImpactStories();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      {/* Banner Principal */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight">Histórias de Transformação</h1>
          <p className="text-primary-light mt-2 text-lg font-light max-w-xl">
            Vozes reais de quem vivencia no cotidiano a reconstrução da cidadania e da autonomia de renda.
          </p>
        </div>
      </section>

      {/* Listagem Conectada ao Supabase */}
      <HistoriasClient initialStories={stories} />
    </div>
  );
}
