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
import { impactStories } from '@/lib/mock-data';
import { ImpactStory } from '@/types';

type RoleFilter = 'all' | ImpactStory['role'];

export default function HistoriasPage() {
  const [activeFilter, setActiveFilter] = useState<RoleFilter>('all');

  // Lógica de filtragem
  const filteredStories = useMemo(() => {
    if (activeFilter === 'all') return impactStories;
    return impactStories.filter((story) => story.role === activeFilter);
  }, [activeFilter]);

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

      {/* Botões de Filtros no Cliente */}
      <section className="py-10 px-4 max-w-7xl mx-auto w-full sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto gap-3 pb-3 border-b border-slate-200 scrollbar-none snap-x justify-start md:justify-center">
          <button
            onClick={() => setActiveFilter('all')}
            type="button"
            className={`px-5 py-3 rounded-full font-bold text-xs tracking-wider uppercase shrink-0 snap-center transition-all ${
              activeFilter === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Todos os Perfis
          </button>
          <button
            onClick={() => setActiveFilter('participante')}
            type="button"
            className={`flex items-center gap-1.5 px-5 py-3 rounded-full font-bold text-xs tracking-wider uppercase shrink-0 snap-center transition-all ${
              activeFilter === 'participante'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <User className="h-4 w-4 shrink-0" /> Alunos
          </button>
          <button
            onClick={() => setActiveFilter('empreendedor')}
            type="button"
            className={`flex items-center gap-1.5 px-5 py-3 rounded-full font-bold text-xs tracking-wider uppercase shrink-0 snap-center transition-all ${
              activeFilter === 'empreendedor'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="h-4 w-4 shrink-0" /> Empreendedores
          </button>
          <button
            onClick={() => setActiveFilter('voluntario')}
            type="button"
            className={`flex items-center gap-1.5 px-5 py-3 rounded-full font-bold text-xs tracking-wider uppercase shrink-0 snap-center transition-all ${
              activeFilter === 'voluntario'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Users className="h-4 w-4 shrink-0" /> Voluntários
          </button>
          <button
            onClick={() => setActiveFilter('parceiro')}
            type="button"
            className={`flex items-center gap-1.5 px-5 py-3 rounded-full font-bold text-xs tracking-wider uppercase shrink-0 snap-center transition-all ${
              activeFilter === 'parceiro'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart className="h-4 w-4 shrink-0" /> Apoiadores
          </button>
        </div>
      </section>

      {/* Listagem de Depoimentos */}
      <section className="pb-24 px-4 max-w-7xl mx-auto w-full sm:px-6 lg:px-8">
        {filteredStories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Nenhum depoimento</h3>
            <p className="text-slate-500 text-sm">
              Não localizamos nenhuma história cadastrada correspondente a esta categoria no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredStories.map((story) => {
              const roleMeta = getRoleLabel(story.role);
              const RoleIcon = roleMeta.icon;

              return (
                <div 
                  key={story.id}
                  className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between relative hover:shadow-md transition-shadow group"
                >
                  <div className="absolute top-8 right-8 text-slate-100 group-hover:text-primary-light transition-colors duration-300">
                    <Quote className="h-10 w-10 fill-current" />
                  </div>

                  <div className="space-y-6">
                    {/* Badge do Perfil */}
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleMeta.color}`}>
                        <RoleIcon className="h-3.5 w-3.5 shrink-0" />
                        {roleMeta.label}
                      </span>
                    </div>

                    {/* Depoimento Completo */}
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed relative z-10 font-light">
                      {story.story}
                    </p>

                    {/* Citação Direta */}
                    <div className="p-4 bg-slate-50 border-l-4 border-primary rounded-r-xl">
                      <p className="text-slate-800 font-bold text-sm italic">
                        &ldquo;{story.quote}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Informações do Autor */}
                  <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={story.imageUrl}
                      alt={story.name}
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-14 rounded-full object-cover shadow-inner bg-slate-100 shrink-0 border border-slate-200/50"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base">{story.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {story.age ? `${story.age} anos • ` : ''}Projeto: {story.project}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Chamada para Ação Final */}
      <section className="bg-gradient-to-br from-primary via-primary-hover to-slate-900 text-white text-center py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-light text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" /> Faça a Diferença
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Escreva o próximo capítulo conosco
          </h2>
          <p className="text-primary-light text-base font-light max-w-xl mx-auto">
            Sua doação, voluntariado ou parceria viabiliza o surgimento de novas histórias de superação e autonomia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/#doe"
              className="inline-flex items-center justify-center rounded-xl bg-secondary px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-secondary-hover transition-all focus:outline-none"
            >
              Fazer Doação
            </Link>
            <Link
              href="/#participe"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-all focus:outline-none"
            >
              Seja Voluntário
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
