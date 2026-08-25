'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  BookOpen, 
  SlidersHorizontal, 
  RotateCcw, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { CourseEvent } from '@/types';

interface AgendaClientProps {
  initialEvents: CourseEvent[];
}

export default function AgendaClient({ initialEvents }: AgendaClientProps) {
  const [filterUnit, setFilterUnit] = useState<string>('all');
  const [filterModality, setFilterModality] = useState<string>('all');
  const [filterShift, setFilterShift] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const units = useMemo(() => {
    const allUnits = initialEvents.map(e => e.locationName);
    return ['all', ...Array.from(new Set(allUnits.filter(Boolean)))];
  }, [initialEvents]);

  const categories = useMemo(() => {
    const allCats = initialEvents.map(e => e.category);
    return ['all', ...Array.from(new Set(allCats.filter(Boolean)))];
  }, [initialEvents]);

  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      const matchUnit = filterUnit === 'all' || event.locationName === filterUnit;
      const matchModality = filterModality === 'all' || event.modality === filterModality;
      const matchShift = filterShift === 'all' || event.shift === filterShift;
      const matchCategory = filterCategory === 'all' || event.category === filterCategory;

      return matchUnit && matchModality && matchShift && matchCategory;
    });
  }, [initialEvents, filterUnit, filterModality, filterShift, filterCategory]);

  const resetFilters = () => {
    setFilterUnit('all');
    setFilterModality('all');
    setFilterShift('all');
    setFilterCategory('all');
  };

  const getStatusBadge = (statusText: CourseEvent['statusText']) => {
    switch (statusText) {
      case 'inscricoes-abertas':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase tracking-wider">
            Inscrições Abertas
          </span>
        );
      case 'lista-espera':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 uppercase tracking-wider">
            Lista de Espera
          </span>
        );
      case 'encerrado':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 uppercase tracking-wider">
            Encerrado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Painel de Filtros (Lateral) */}
      <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="h-4.5 w-4.5 text-primary" /> Filtros
          </h3>
          <button
            onClick={resetFilters}
            type="button"
            className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" /> Limpar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
          {/* Filtro Unidade */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Unidade / Polo
            </label>
            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todas as Unidades</option>
              {units.filter(u => u !== 'all').map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          {/* Filtro Modalidade */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Modalidade
            </label>
            <select
              value={filterModality}
              onChange={(e) => setFilterModality(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todas</option>
              <option value="presencial">Presencial</option>
              <option value="online">Online</option>
            </select>
          </div>

          {/* Filtro Turno */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Turno
            </label>
            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todos</option>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
              <option value="sabado">Sábado</option>
            </select>
          </div>

          {/* Filtro Categoria */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Categoria
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todas as Categorias</option>
              {categories.filter(c => c !== 'all').map((c) => (
                <option key={c} value={c} className="capitalize">
                  {c === 'capacitacao' ? 'Capacitação' : c === 'socioeducativo' ? 'Socioeducativo' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Listagem de Oportunidades */}
      <div className="lg:col-span-9 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-500">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'oportunidade encontrada' : 'oportunidades encontradas'}
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Nenhum curso ou oficina encontrado</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Não localizamos nenhuma oportunidade ativa correspondente aos filtros selecionados. Tente limpar os filtros para ver todas as vagas.
            </p>
            <button
              onClick={resetFilters}
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md shadow-primary/10 hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Ver Todos os Cursos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <div 
                key={event.id}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
              >
                {/* Imagem do Evento */}
                <div className="relative h-44 overflow-hidden bg-slate-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/content/oficina-artesanato.jpg';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    {getStatusBadge(event.statusText)}
                  </div>
                </div>

                {/* Informações */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded uppercase tracking-wider">
                        {event.workload}
                      </span>
                      <span className="text-[10px] font-bold text-secondary bg-secondary-light px-2 py-0.5 rounded uppercase tracking-wider">
                        {event.modality}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        Turno: {event.shift}
                      </span>
                    </div>
                    
                    <h3 className="font-extrabold text-slate-800 text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-slate-600 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  {/* Local e Ação */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{event.locationName}</span>
                    </div>

                    {event.statusText === 'inscricoes-abertas' ? (
                      <Link
                        href={`/agenda/${event.slug}`}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm shadow-primary/10 hover:bg-primary-hover transition-colors focus:outline-none"
                      >
                        Quero me Inscrever
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : event.statusText === 'lista-espera' ? (
                      <Link
                        href={`/agenda/${event.slug}`}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-700 transition-colors focus:outline-none"
                      >
                        Entrar na Lista de Espera
                        <Sparkles className="h-4 w-4" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex w-full items-center justify-center rounded-xl bg-slate-100 border border-slate-200 px-4 py-3 text-sm font-bold text-slate-400 cursor-not-allowed"
                      >
                        Inscrições Encerradas
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
