'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  User, 
  TrendingUp, 
  Users, 
  Sparkles,
  Quote
} from 'lucide-react';
import { ImpactStory } from '@/types';

type RoleFilter = 'all' | ImpactStory['role'];

interface HistoriasClientProps {
  initialStories: ImpactStory[];
}

export default function HistoriasClient({ initialStories }: HistoriasClientProps) {
  const [activeFilter, setActiveFilter] = useState<RoleFilter>('all');

  const filteredStories = useMemo(() => {
    if (activeFilter === 'all') return initialStories;
    return initialStories.filter((story) => story.role === activeFilter);
  }, [initialStories, activeFilter]);

  const getRoleLabel = (role: ImpactStory['role']) => {
    switch (role) {
      case 'participante':
        return { label: 'Aluno / Participante', color: 'bg-green-100 text-green-700 border-green-200', icon: User };
      case 'empreendedor':
        return { label: 'Empreendedor Local', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: TrendingUp };
      case 'voluntario':
        return { label: 'Voluntário', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Users };
      case 'parceiro':
        return { label: 'Apoiador / Doador', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Heart };
      default:
        return { label: role, color: 'bg-slate-100 text-slate-700 border-slate-200', icon: User };
    }
  };

  return (
    <>
      {/* Botões de Filtros */}
      <section className="py-10 px-4 max-w-7xl mx-auto w-full sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto gap-3 pb-3 border-b border-slate-200 scrollbar-none snap-x justify-start md:justify-center">
          <button
            onClick={() => setActiveFilter('all')}
            type="button"
            className={`px-5 py-3 rounded-full font-bold text-xs tracking-wider uppercase shrink-0 snap-center transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            Todas as Vozes
          </button>
          <button
            onClick={() => setActiveFilter('participante')}
            type="button"
            className={`px-5 py-3 rounded-full font-bold text-xs tracking-wider uppercase shrink-0 snap-center transition-all cursor-pointer ${
              activeFilter === 'participante'
                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            Alunos & Participantes
          </button>
          <button
            onClick={() => setActiveFilter('empreendedor')}
            type="button"
            className={`px-5 py-3 rounded-full font-bold text-xs tracking-wider uppercase shrink-0 snap-center transition-all cursor-pointer ${
              activeFilter === 'empreendedor'
                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            Empreendedores
          </button>
          <button
            onClick={() => setActiveFilter('voluntario')}
            type="button"
            className={`px-5 py-3 rounded-full font-bold text-xs tracking-wider uppercase shrink-0 snap-center transition-all cursor-pointer ${
              activeFilter === 'voluntario'
                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            Voluntários
          </button>
          <button
            onClick={() => setActiveFilter('parceiro')}
            type="button"
            className={`px-5 py-3 rounded-full font-bold text-xs tracking-wider uppercase shrink-0 snap-center transition-all cursor-pointer ${
              activeFilter === 'parceiro'
                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            Apoiadores & Doadores
          </button>
        </div>
      </section>

      {/* Grid de Depoimentos */}
      <section className="py-6 px-4 max-w-7xl mx-auto w-full sm:px-6 lg:px-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredStories.map((item) => {
            const roleInfo = getRoleLabel(item.role);
            const RoleIcon = roleInfo.icon;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group overflow-hidden"
              >
                {/* Elemento Decorativo de Aspas */}
                <div className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 transition-colors pointer-events-none">
                  <Quote className="h-16 w-16" />
                </div>

                <div className="space-y-6 relative z-10">
                  {/* Cabeçalho do Card */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-lg">
                          {item.name}
                        </h3>
                        {item.age && (
                          <span className="text-xs text-slate-400 font-semibold">
                            ({item.age} anos)
                          </span>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${roleInfo.color}`}>
                        <RoleIcon className="h-3 w-3" />
                        {roleInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Frase / Citação de Destaque */}
                  <blockquote className="text-slate-800 font-bold text-base italic leading-snug border-l-4 border-primary pl-4">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>

                  {/* Texto Narrativo Completo */}
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {item.story}
                  </p>
                </div>

                {/* Rodapé do Card com Projeto Vinculado */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-secondary" /> {item.project}
                  </span>
                  <Link
                    href="/faca-parte"
                    className="text-xs font-bold text-slate-500 hover:text-primary transition-colors"
                  >
                    Faça Parte Desta História &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
