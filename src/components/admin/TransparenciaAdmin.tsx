'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus, Edit, Trash2, Search, ExternalLink, AlertTriangle,
  Loader2, ChevronLeft, ChevronRight, FileText, CheckCircle2, Clock, X, Save
} from 'lucide-react';
import { TransparencyDoc } from '@/types';
import { saveDocumentAction, deleteDocumentAction } from '@/app/admin/transparencia/actions';
import { validateDriveUrl } from '@/lib/drive';

const CATEGORY_LABELS: Record<string, string> = {
  institucional: 'Institucional',
  governanca:    'Governança',
  atividades:    'Rel. Atividades',
  contas:        'Prestação de Contas',
  mrosc:         'Parcerias MROSC',
  politicas:     'Políticas',
};
const CATEGORY_COLORS: Record<string, string> = {
  institucional: 'bg-primary/10 text-primary',
  governanca:    'bg-violet-100 text-violet-700',
  atividades:    'bg-emerald-100 text-emerald-700',
  contas:        'bg-amber-100 text-amber-700',
  mrosc:         'bg-secondary/10 text-secondary',
  politicas:     'bg-slate-100 text-slate-600',
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i + 1);

const EMPTY_DOC: Omit<TransparencyDoc, 'id'> = {
  title: '',
  year: CURRENT_YEAR,
  category: 'institucional',
  status: 'disponivel',
  fileUrl: '',
  fileSize: '—',
  fileType: 'PDF',
  publishDate: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
};

export default function TransparenciaAdmin({ initialDocs }: { initialDocs: TransparencyDoc[] }) {
  const [docs, setDocs] = useState<TransparencyDoc[]>(initialDocs);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal de formulário
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<TransparencyDoc | null>(null);
  const [form, setForm] = useState<Omit<TransparencyDoc, 'id'>>(EMPTY_DOC);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Exclusão
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      const matchSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'all' || d.category === categoryFilter;
      const matchYear = yearFilter === 'all' || d.year.toString() === yearFilter;
      return matchSearch && matchCat && matchYear;
    });
  }, [docs, searchTerm, categoryFilter, yearFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const openAdd = () => { setEditingDoc(null); setForm(EMPTY_DOC); setFormError(null); setShowModal(true); };
  const openEdit = (doc: TransparencyDoc) => {
    setEditingDoc(doc);
    setForm({ title: doc.title, year: doc.year, category: doc.category, status: doc.status, fileUrl: doc.fileUrl, fileSize: doc.fileSize, fileType: doc.fileType, publishDate: doc.publishDate });
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    setFormError(null);
    if (!form.title.trim()) { setFormError('O título é obrigatório.'); return; }
    if (!form.fileUrl.trim()) { setFormError('O link do Google Drive é obrigatório.'); return; }
    if (!validateDriveUrl(form.fileUrl)) { setFormError('URL inválida. Use um link de compartilhamento do Google Drive (drive.google.com).'); return; }

    setIsSaving(true);
    try {
      const docToSave: TransparencyDoc = { id: editingDoc?.id ?? '', ...form };
      await saveDocumentAction(docToSave);
      if (editingDoc) {
        setDocs((prev) => prev.map((d) => d.id === editingDoc.id ? docToSave : d));
      } else {
        setDocs((prev) => [{ ...docToSave, id: `mock-doc-${Date.now()}` }, ...prev]);
      }
      setShowModal(false);
    } catch { setFormError('Erro ao salvar. Tente novamente.'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try { await deleteDocumentAction(id); setDocs((prev) => prev.filter((d) => d.id !== id)); }
    catch { alert('Erro ao excluir.'); }
    finally { setDeletingId(null); setIsDeleting(false); }
  };

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Buscar documento..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="all">Todas as seções</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={yearFilter} onChange={(e) => { setYearFilter(e.target.value); setCurrentPage(1); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="all">Todos os anos</option>
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-secondary-hover transition-colors whitespace-nowrap">
          <Plus className="h-4 w-4" /> Novo Documento
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-16 text-center text-slate-400"><FileText className="h-10 w-10 mx-auto mb-3 opacity-30" /><p className="font-semibold">Nenhum documento encontrado.</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-5 py-3.5">Documento</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden md:table-cell">Seção</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden lg:table-cell">Ano</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800 line-clamp-1">{doc.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{doc.publishDate} • {doc.fileType} • {doc.fileSize}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${CATEGORY_COLORS[doc.category]}`}>
                      {CATEGORY_LABELS[doc.category]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500 font-semibold hidden lg:table-cell">{doc.year}</td>
                  <td className="px-4 py-4">
                    {doc.status === 'disponivel' ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1">
                        <CheckCircle2 className="h-3 w-3" /> Disponível
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 rounded-full px-2.5 py-1">
                        <Clock className="h-3 w-3" /> Em atualização
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors" title="Abrir no Drive">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button onClick={() => openEdit(doc)} className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors" title="Editar">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeletingId(doc.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors" title="Excluir">
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
          <span>{filtered.length} documentos</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
            <span className="font-semibold text-slate-700">{currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {/* Modal Formulário */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">{editingDoc ? 'Editar Documento' : 'Novo Documento'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="h-5 w-5" /></button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold flex gap-2 items-start">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />{formError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Título *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Balanço Patrimonial e DRE 2025" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Seção *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as TransparencyDoc['category'] })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary">
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Ano *</label>
                  <select value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary">
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Link do Google Drive *</label>
                <input type="url" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="https://drive.google.com/file/d/.../view?usp=sharing" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" />
                <p className="text-[10px] text-slate-400 mt-1">Cole o link público de compartilhamento do Google Drive.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TransparencyDoc['status'] })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="disponivel">Disponível</option>
                    <option value="atualizacao">Em atualização</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Data de Publicação</label>
                  <input type="text" value={form.publishDate} onChange={(e) => setForm({ ...form, publishDate: e.target.value })} placeholder="Ex: 10 Jan 2026" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} disabled={isSaving} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60 flex items-center justify-center gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Excluir */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-rose-100 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-rose-600" /></div>
              <div><h3 className="font-black text-slate-800">Excluir documento?</h3><p className="text-xs text-slate-500 mt-0.5">Esta ação não pode ser desfeita.</p></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeletingId(null)} disabled={isDeleting} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
              <button onClick={() => handleDelete(deletingId)} disabled={isDeleting} className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
