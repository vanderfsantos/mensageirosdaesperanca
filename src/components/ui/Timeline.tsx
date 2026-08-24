'use client';

import React, { useState } from 'react';
import { 
  Flag, 
  Flame, 
  Monitor, 
  ShieldAlert, 
  Briefcase, 
  MapPin, 
  Award, 
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

export default function Timeline() {
  const events: TimelineEvent[] = [
    {
      year: '1998',
      title: 'Fundação da Mensageiros da Esperança',
      description: 'Nascemos da mobilização comunitária para acolher e dar suporte a famílias em alta vulnerabilidade social na Lapa, com distribuição de alimentos e apoio socioeducativo básico.',
      Icon: Flag,
    },
    {
      year: '2014',
      title: 'Inauguração da Cozinha-Escola',
      description: 'Implementação do nosso primeiro projeto de gastronomia social com foco na capacitação técnica de panificação e confeitaria, gerando as bases para a autonomia de dezenas de mulheres.',
      Icon: Flame,
    },
    {
      year: '2018',
      title: 'Primeiro Núcleo de Inclusão Digital',
      description: 'Inauguração de laboratório tecnológico para jovens e adultos, integrando letramento digital básico e introdução ao mercado corporativo técnico.',
      Icon: Monitor,
    },
    {
      year: '2020',
      title: 'Combate à Pandemia e Cuidado Psicossocial',
      description: 'Distribuição massiva de cestas básicas e kits de higiene. Lançamento do Plantão Psicossocial Emergencial para mitigar os efeitos da crise sanitária e de isolamento nas famílias.',
      Icon: ShieldAlert,
    },
    {
      year: '2021',
      title: 'Acordo com o Instituto Inovação Sustentável',
      description: 'Parceria formal para o desenvolvimento institucional, governança e captação de recursos corporativos ESG, consolidando novos padrões administrativos.',
      Icon: Briefcase,
    },
    {
      year: '2023-2024',
      title: 'Polo Praça da Cidadania Osasco',
      description: 'Expansão de atividades de informática e costura no polo da Praça da Cidadania de Osasco, descentralizando nossos serviços para outras regiões da grande São Paulo.',
      Icon: MapPin,
    },
    {
      year: '2025',
      title: 'Marca Histórica de Certificações',
      description: 'Certificamos mais de 1.111 concluintes em nossas oficinas profissionalizantes livres de panificação, TI e empreendedorismo em apenas 12 meses.',
      Icon: Award,
    },
    {
      year: '2026',
      title: 'Governança ESG e ODS 18',
      description: 'Planejamento alinhado aos padrões globais de sustentabilidade, foco em inclusão de diversidade étnico-racial (ODS 18) e consolidação dos Negócios Sociais de faturamento revertido.',
      Icon: Sparkles,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextEvent = () => {
    setActiveIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  const prevEvent = () => {
    setActiveIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const ActiveIcon = events[activeIndex].Icon;

  return (
    <div className="w-full space-y-12">
      {/* Seletor de Anos com Linhas em brand-teal e Anos em brand-orange */}
      <div className="relative">
        {/* Linha horizontal em brand-teal */}
        <div className="absolute top-1/2 left-4 right-4 h-1 bg-brand-teal/30 -translate-y-1/2 hidden md:block" />
        
        <div className="flex md:justify-between items-center gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-none relative snap-x">
          {events.map((event, idx) => (
            <button
              key={event.year}
              onClick={() => setActiveIndex(idx)}
              type="button"
              className={`relative z-10 flex flex-col items-center shrink-0 snap-center focus:outline-none ${
                idx === activeIndex ? 'scale-110' : 'hover:scale-105'
              } transition-transform duration-300`}
            >
              {/* Marcador do Ano */}
              <div
                className={`flex h-12 w-24 items-center justify-center rounded-full font-black text-sm shadow-md transition-all duration-300 ${
                  idx === activeIndex
                    ? 'bg-brand-orange text-white scale-105 ring-4 ring-brand-orange/20'
                    : 'bg-white text-brand-teal border-2 border-brand-teal/40 hover:border-brand-teal'
                }`}
              >
                {event.year}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Box de Exibição do Evento Selecionado */}
      <div className="bg-white rounded-3xl border border-brand-gray-surface p-8 md:p-12 shadow-sm transition-all duration-500 hover:shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal-light/50 rounded-bl-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Coluna 1: Ícone */}
          <div className="md:col-span-3 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-brand-teal-light text-brand-teal shadow-sm border border-brand-teal/20">
              <ActiveIcon className="h-12 w-12" />
            </div>
          </div>

          {/* Coluna 2: Informações */}
          <div className="md:col-span-9 space-y-3 text-center md:text-left">
            <div className="space-y-1">
              <span className="text-xs font-black text-brand-orange uppercase tracking-widest">
                Marco Histórico • Ano {events[activeIndex].year}
              </span>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                {events[activeIndex].title}
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-base">
              {events[activeIndex].description}
            </p>
          </div>
        </div>

        {/* Botões de Navegação */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={prevEvent}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal-light hover:bg-brand-teal hover:text-white text-brand-teal transition-colors focus:outline-none"
            aria-label="Voltar marco histórico"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextEvent}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-teal-light hover:bg-brand-teal hover:text-white text-brand-teal transition-colors focus:outline-none"
            aria-label="Avançar marco histórico"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
