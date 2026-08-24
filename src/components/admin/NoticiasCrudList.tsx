'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight,
  AlertTriangle, Loader2, Star, StarOff, FileText, Radio
} from 'lucide-react';
import { NewsPost } from '@/types';
import { deleteNewsAction, toggleNewsStatusAction } from '@/app/admin/noticias/actions';

const CATEGORY_COLORS: Record<string, string> = {
  'Cursos':             'bg-primary/10 text-primary',
  'Eventos e Campanhas':'bg-secondary/10 text-secondary',
  'Parcerias':          'bg-violet-100 text-violet-700',
  'Impacto':            'bg-emerald-100 text-emerald-700',
  'Artigos':            'bg-amber-100 text-amber-700',
  'Imprensa':           'bg-slate-100 text-slate-600',
};

export default function NoticiasCrudList({ initialPosts }: { initialPosts: NewsPost[] }) {
  const [posts, setPosts] = useState<NewsPost[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || p.publishedStatus === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [posts, searchTerm, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteNewsAction(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Erro ao excluir. Tente novamente.');
    } finally {
      setDeletingId(null);
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (id: string, current: 'publicado' | 'rascunho') => {
    const next = current === 'publicado' ? 'rascunho' : 'publicado';
    setUpdatingId(id);
    try {
      await toggleNewsStatusAction(id, next);
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, publishedStatus: next } : p));
    } catch {
      alert('Erro ao alterar status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controles de busca e filtro */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título ou autor..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Todas as categorias</option>
          {['Cursos','Eventos e Campanhas','Parcerias','Impacto','Artigos','Imprensa'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Todos os status</option>
          <option value="publicado">Publicado</option>
          <option value="rascunho">Rascunho</option>
        </select>
        <Link
          href="/admin/noticias/nova"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-secondary-hover transition-colors whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> Nova Notícia
        </Link>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Nenhuma notícia encontrada.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-5 py-3.5">Título</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden md:table-cell">Categoria</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden lg:table-cell">Autor</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden lg:table-cell">Data</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {post.featured && (
                        <Star className="h-3.5 w-3.5 text-amber-400 shrink-0" fill="currentColor" />
                      )}
                      <span className="font-semibold text-slate-800 line-clamp-1">{post.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 hidden sm:block">{post.excerpt}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${CATEGORY_COLORS[post.category] ?? 'bg-slate-100 text-slate-600'}`}>
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500 hidden lg:table-cell">{post.author}</td>
                  <td className="px-4 py-4 text-slate-400 text-xs hidden lg:table-cell">{post.date}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleToggleStatus(post.id, post.publishedStatus)}
                      disabled={updatingId === post.id}
                      title={post.publishedStatus === 'publicado' ? 'Mover para rascunho' : 'Publicar'}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
                        post.publishedStatus === 'publicado'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {updatingId === post.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : post.publishedStatus === 'publicado' ? (
                        <><Radio className="h-3 w-3" />Publicado</>
                      ) : (
                        <><FileText className="h-3 w-3" />Rascunho</>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Destacar/Remover destaque */}
                      <button
                        onClick={async () => {
                          const updated = { ...post, featured: !post.featured };
                          await toggleNewsStatusAction(post.id, post.publishedStatus);
                          setPosts((prev) => prev.map((p) => p.id === post.id ? updated : p));
                        }}
                        title={post.featured ? 'Remover destaque' : 'Destacar na Home'}
                        className="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                      >
                        {post.featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                      </button>
                      <Link
                        href={`/admin/noticias/${post.id}`}
                        className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeletingId(post.id)}
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
          <span>{filtered.length} notícias encontradas</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-semibold text-slate-700">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-800">Excluir notícia?</h3>
                <p className="text-xs text-slate-500 mt-0.5">Esta ação não pode ser desfeita.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white hover:bg-rose-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
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
