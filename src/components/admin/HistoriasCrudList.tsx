'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight,
  AlertTriangle, Loader2, Heart, ShieldCheck
} from 'lucide-react';
import { ImpactStory } from '@/types';
import { deleteStoryAction } from '@/app/admin/historias/actions';

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  participante:  { label: 'Participante',  color: 'bg-primary/10 text-primary' },
  empreendedor:  { label: 'Empreendedor',  color: 'bg-secondary/10 text-secondary' },
  voluntario:    { label: 'Voluntário/Educador', color: 'bg-violet-100 text-violet-700' },
  parceiro:      { label: 'Parceiro',      color: 'bg-amber-100 text-amber-700' },
};

export default function HistoriasCrudList({ initialStories }: { initialStories: ImpactStory[] }) {
  const [stories, setStories] = useState<ImpactStory[]>(initialStories);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() => {
    return stories.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.project.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === 'all' || s.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [stories, searchTerm, roleFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteStoryAction(id);
      setStories((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert('Erro ao excluir. Tente novamente.');
    } finally {
      setDeletingId(null);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou projeto..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Todos os perfis</option>
          <option value="participante">Participantes</option>
          <option value="empreendedor">Empreendedores</option>
          <option value="voluntario">Voluntários e Educadores</option>
          <option value="parceiro">Parceiros</option>
        </select>
        <Link
          href="/admin/historias/nova"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-secondary-hover transition-colors whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> Nova História
        </Link>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Heart className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Nenhuma história encontrada.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-5 py-3.5">Pessoa</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden md:table-cell">Perfil</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden lg:table-cell">Projeto</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5">LGPD</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((story) => (
                <tr key={story.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {story.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={story.imageUrl}
                          alt={story.name}
                          className="h-9 w-9 rounded-full object-cover shrink-0 border border-slate-100"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-slate-800">{story.name}</p>
                        {story.age && <p className="text-xs text-slate-400">{story.age} anos</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${ROLE_CONFIG[story.role]?.color ?? 'bg-slate-100 text-slate-600'}`}>
                      {ROLE_CONFIG[story.role]?.label ?? story.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500 text-xs hidden lg:table-cell">{story.project}</td>
                  <td className="px-4 py-4">
                    {story.lgpdConsent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2.5 py-1">
                        <ShieldCheck className="h-3 w-3" /> Autorizado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 rounded-full px-2.5 py-1">
                        Pendente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/historias/${story.id}`}
                        className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeletingId(story.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{filtered.length} histórias encontradas</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-semibold text-slate-700">{currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmação */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-800">Excluir história?</h3>
                <p className="text-xs text-slate-500 mt-0.5">Esta ação não pode ser desfeita.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeletingId(null)} disabled={isDeleting} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
              <button onClick={() => handleDelete(deletingId)} disabled={isDeleting} className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white hover:bg-rose-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
