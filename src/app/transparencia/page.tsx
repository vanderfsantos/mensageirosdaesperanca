import React from 'react';
import { getTransparencyDocs } from '@/lib/supabaseClient';
import TransparenciaClient from '@/components/transparencia/TransparenciaClient';

export const metadata = {
  title: 'Portal da Transparência | Mensageiros da Esperança',
  description: 'Acesse os relatórios anuais de atividades, balanços patrimoniais, demonstrações contábeis e documentos institucionais da OSC Mensageiros da Esperança.',
};

export default async function TransparenciaPage() {
  const docs = await getTransparencyDocs();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      {/* Banner Principal */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight">Portal da Transparência</h1>
          <p className="text-primary-light mt-2 text-lg font-light max-w-xl">
            Acesso público aos nossos documentos contábeis, estatutários e relatórios de atividades para auditoria social.
          </p>
        </div>
      </section>

      {/* Repositório por Abas e Filtros Conectado ao Supabase */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full sm:px-6 lg:px-8 flex-grow">
        <TransparenciaClient initialDocs={docs} />
      </section>
    </div>
  );
}
