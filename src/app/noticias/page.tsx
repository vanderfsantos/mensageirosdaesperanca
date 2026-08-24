import React from 'react';
import { getNewsPosts } from '@/lib/supabaseClient';
import NoticiasList from '@/components/ui/NoticiasList';

export const metadata = {
  title: 'Notícias e Blog | Mensageiros da Esperança',
  description: 'Acompanhe as últimas notícias, conquistas, projetos e campanhas da OSC Mensageiros da Esperança.',
};

export default async function NoticiasPage() {
  // Busca os posts usando o client resiliente (Supabase com fallback mock-data)
  const posts = await getNewsPosts();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      {/* Banner Principal */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight">Notícias e Artigos</h1>
          <p className="text-primary-light mt-2 text-lg font-light max-w-xl">
            Acompanhe nossas principais realizações, campanhas solidárias e histórias de impacto comunitário.
          </p>
        </div>
      </section>

      {/* Listagem de Notícias */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full sm:px-6 lg:px-8 flex-grow">
        <NoticiasList posts={posts} />
      </section>
    </div>
  );
}
