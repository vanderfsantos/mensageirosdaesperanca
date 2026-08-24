import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, 
  BookOpen, 
  Check, 
  ArrowLeft
} from 'lucide-react';
import { courseEvents } from '@/lib/mock-data';
import RegistrationForm from '@/components/ui/RegistrationForm';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const event = courseEvents.find((e) => e.slug === slug);
  
  return {
    title: event ? `${event.title} | Mensageiros da Esperança` : 'Curso não encontrado',
    description: event ? event.description : '',
  };
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const event = courseEvents.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      {/* Seção Superior - Breadcrumb e Título */}
      <section className="bg-slate-900 text-white py-12 px-4 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/agenda"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para a Agenda
          </Link>
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded bg-primary/20 text-primary-light text-xs font-bold uppercase tracking-wider">
              {event.category === 'capacitacao' ? 'Capacitação Profissional' : event.category === 'socioeducativo' ? 'Ação Socioeducativa' : event.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Detalhamento do Curso & Formulário */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full sm:px-6 lg:px-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Coluna 1: Informações e Grade Curricular */}
          <div className="lg:col-span-7 space-y-10">
            {/* Imagem de Destaque */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-3xl bg-slate-200 border border-slate-200/60 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Descrição */}
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-slate-800">Sobre o Curso</h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {event.description}
              </p>
            </div>

            {/* Metadados / Detalhes rápidos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-slate-200/60">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Carga Horária</span>
                <span className="text-sm font-bold text-slate-700">{event.workload}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Modalidade</span>
                <span className="text-sm font-bold text-slate-700 capitalize">{event.modality}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Turno</span>
                <span className="text-sm font-bold text-slate-700 capitalize">{event.shift}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Vagas</span>
                <span className="text-sm font-bold text-slate-700">
                  {event.spotsLeft !== undefined && event.spotsLeft > 0 ? `${event.spotsLeft} disponíveis` : 'Lista de Espera'}
                </span>
              </div>
            </div>

            {/* Grade Curricular / Syllabus */}
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <BookOpen className="h-5.5 w-5.5 text-primary" /> Conteúdo Programático
              </h2>
              <ul className="space-y-4">
                {event.syllabus.map((topic, index) => (
                  <li key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200/50">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-light text-primary shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-slate-700 text-sm md:text-base leading-relaxed">
                      {topic}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Localização da Unidade */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200/60 space-y-3">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-primary" /> Local de Realização
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {event.location}
              </p>
            </div>
          </div>

          {/* Coluna 2: Card de Matrícula (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <RegistrationForm eventTitle={event.title} statusText={event.statusText} />
          </div>

        </div>
      </section>
    </div>
  );
}
