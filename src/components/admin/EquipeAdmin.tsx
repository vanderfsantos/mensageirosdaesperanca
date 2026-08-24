'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus, Edit, Trash2, Loader2, AlertTriangle, X, Save,
  Users, Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import { TeamMember } from '@/types';
import { saveMemberAction, deleteMemberAction } from '@/app/admin/equipe/actions';

const EMPTY: Omit<TeamMember, 'id'> = {
  name: '', role: '', mandate: '', displayOrder: 99,
  imageUrl: '', bio: '', linkedinUrl: '', email: '',
};

export default function EquipeAdmin({ initialMembers }: { initialMembers: TeamMember[] }) {
  const [members, setMembers] = useState<TeamMember[]>(
    [...initialMembers].sort((a, b) => a.displayOrder - b.displayOrder)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<Omit<TeamMember, 'id'>>(EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() =>
    members.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase())
    ), [members, searchTerm]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const openAdd = () => { setEditingMember(null); setForm(EMPTY); setFormError(null); setShowModal(true); };
  const openEdit = (m: TeamMember) => {
    setEditingMember(m);
    setForm({ name: m.name, role: m.role, mandate: m.mandate ?? '', displayOrder: m.displayOrder, imageUrl: m.imageUrl, bio: m.bio ?? '', linkedinUrl: m.linkedinUrl ?? '', email: m.email ?? '' });
    setFormError(null); setShowModal(true);
  };

  const handleSave = async () => {
    setFormError(null);
    if (!form.name.trim()) { setFormError('O nome é obrigatório.'); return; }
    if (!form.role.trim()) { setFormError('O cargo é obrigatório.'); return; }
    if (!form.imageUrl.trim()) { setFormError('A URL da foto é obrigatória.'); return; }
    setIsSaving(true);
    try {
      const member: TeamMember = { id: editingMember?.id ?? '', ...form };
      await saveMemberAction(member);
      if (editingMember) {
        setMembers((prev) => [...prev.map((m) => m.id === editingMember.id ? member : m)].sort((a, b) => a.displayOrder - b.displayOrder));
      } else {
        setMembers((prev) => [...prev, { ...member, id: `mock-member-${Date.now()}` }].sort((a, b) => a.displayOrder - b.displayOrder));
      }
      setShowModal(false);
    } catch { setFormError('Erro ao salvar. Tente novamente.'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try { await deleteMemberAction(id); setMembers((prev) => prev.filter((m) => m.id !== id)); }
    catch { alert('Erro ao excluir.'); }
    finally { setDeletingId(null); setIsDeleting(false); }
  };

  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Buscar por nome ou cargo..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-secondary-hover transition-colors whitespace-nowrap">
          <Plus className="h-4 w-4" /> Novo Membro
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-16 text-center text-slate-400"><Users className="h-10 w-10 mx-auto mb-3 opacity-30" /><p className="font-semibold">Nenhum membro encontrado.</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-5 py-3.5">Membro</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden md:table-cell">Cargo</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden lg:table-cell">Mandato</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden lg:table-cell">Ordem</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.imageUrl} alt={m.name} className="h-9 w-9 rounded-full object-cover border border-slate-100 shrink-0" onError={(e) => { e.currentTarget.style.display='none'; }} />
                      <div>
                        <p className="font-semibold text-slate-800">{m.name}</p>
                        {m.email && <p className="text-xs text-slate-400">{m.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600 text-xs hidden md:table-cell">{m.role}</td>
                  <td className="px-4 py-4 text-slate-500 text-xs hidden lg:table-cell">{m.mandate || '—'}</td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">{m.displayOrder}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(m)} className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors" title="Editar"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => setDeletingId(m.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors" title="Excluir"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{filtered.length} membros</span>
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
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">{editingMember ? 'Editar Membro' : 'Novo Membro'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="h-5 w-5" /></button>
            </div>
            {formError && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold flex gap-2"><AlertTriangle className="h-4 w-4 shrink-0" />{formError}</div>}

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Nome Completo *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Lorraine Machado" className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Cargo Institucional *</label>
                <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Presidente do Conselho" className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Mandato</label>
                <input type="text" value={form.mandate} onChange={(e) => setForm({ ...form, mandate: e.target.value })} placeholder="2024-2026" className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">URL da Foto *</label>
                <input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">E-mail</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nome@mensageiros.org" className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Ordem de Exibição</label>
                <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 99 })} min={1} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">LinkedIn (URL)</label>
                <input type="url" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Minibiografia</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Breve apresentação profissional..." className={`${inputClass} resize-none`} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} disabled={isSaving} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-1 rounded-xl bg-brand-orange py-3 text-sm font-bold text-white shadow-md shadow-brand-orange/20 hover:bg-brand-orange-dark disabled:opacity-60 flex items-center justify-center gap-2">
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
              <div><h3 className="font-black text-slate-800">Excluir membro?</h3><p className="text-xs text-slate-500 mt-0.5">Esta ação não pode ser desfeita.</p></div>
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
