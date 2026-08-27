'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Mail, Phone, MessageSquare, X,
  CheckCircle2, Archive, AlertTriangle, Loader2, ShieldAlert
} from 'lucide-react';
import { ContactMessage } from '@/types';
import { updateMessageStatusAction } from '@/app/admin/mensagens/actions';

const SUBJECT_OPTIONS = [
  'Todos os assuntos',
  'Cursos', 'Voluntariado', 'Doações', 'Parcerias e Projetos',
  'Orçamento Buffet Social', 'Agendamento Espaço', 'Canal de Escuta', 'Outros',
];

const STATUS_CONFIG = {
  pendente:   { label: 'Pendente',   color: 'bg-amber-100 text-amber-700'   },
  respondido: { label: 'Respondido', color: 'bg-emerald-100 text-emerald-700' },
  arquivado:  { label: 'Arquivado',  color: 'bg-slate-100 text-slate-500'   },
};

export default function MensagensAdmin({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('Todos os assuntos');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const pendingCount = messages.filter((m) => m.status === 'pendente').length;

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSubject = subjectFilter === 'Todos os assuntos' || m.subject === subjectFilter;
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchSearch && matchSubject && matchStatus;
    });
  }, [messages, searchTerm, subjectFilter, statusFilter]);

  const handleUpdateStatus = async (id: string, status: ContactMessage['status']) => {
    setUpdatingId(id);
    try {
      await updateMessageStatusAction(id, status);
      setMessages((prev) => prev.map((m) =>
        m.id === id ? { ...m, status, resolvedAt: status === 'respondido' ? new Date().toLocaleString('pt-BR') : m.resolvedAt } : m
      ));
      if (selectedMsg?.id === id) setSelectedMsg((prev) => prev ? { ...prev, status } : null);
    } catch { alert('Erro ao atualizar status.'); }
    finally { setUpdatingId(null); }
  };

  return (
    <div className="space-y-4">
      {/* Métricas rápidas */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-sm font-bold text-amber-800">
            {pendingCount} {pendingCount === 1 ? 'mensagem pendente' : 'mensagens pendentes'} aguardando resposta.
          </p>
        </div>
      )}

      {/* Controles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Buscar por nome, e-mail ou assunto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary">
          {SUBJECT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="all">Todos os status</option>
          <option value="pendente">Pendentes</option>
          <option value="respondido">Respondidos</option>
          <option value="arquivado">Arquivados</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Nenhuma mensagem encontrada.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[650px] text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-5 py-3.5">Remetente</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden md:table-cell">Assunto</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden lg:table-cell">Recebido</th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((msg) => (
                <tr
                  key={msg.id}
                  className={`hover:bg-slate-50/70 transition-colors cursor-pointer group ${msg.status === 'pendente' ? 'bg-amber-50/30' : ''}`}
                  onClick={() => setSelectedMsg(msg)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {msg.isAnonymous && (
                        <span title="Canal de Escuta Anônimo">
                          <ShieldAlert className="h-4 w-4 text-slate-400 shrink-0" />
                        </span>
                      )}
                      <div>
                        <p className="font-semibold text-slate-800">{msg.name}</p>
                        <p className="text-xs text-slate-400">{msg.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold bg-primary/10 text-primary">
                      {msg.subject}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-400 text-xs hidden lg:table-cell">{msg.receivedAt}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_CONFIG[msg.status].color}`}>
                      {STATUS_CONFIG[msg.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {msg.status !== 'respondido' && (
                        <button onClick={() => handleUpdateStatus(msg.id, 'respondido')} disabled={updatingId === msg.id} className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Marcar como respondido">
                          {updatingId === msg.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        </button>
                      )}
                      {msg.status !== 'arquivado' && (
                        <button onClick={() => handleUpdateStatus(msg.id, 'arquivado')} disabled={updatingId === msg.id} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Arquivar">
                          <Archive className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Modal de leitura */}
      {selectedMsg && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {selectedMsg.isAnonymous && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">
                      <ShieldAlert className="h-3 w-3" /> Canal de Escuta Anônimo
                    </span>
                  )}
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_CONFIG[selectedMsg.status].color}`}>
                    {STATUS_CONFIG[selectedMsg.status].label}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-800">{selectedMsg.subject}</h3>
              </div>
              <button onClick={() => setSelectedMsg(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 shrink-0"><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-2 bg-slate-50 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="font-bold">{selectedMsg.name}</span>
                {selectedMsg.isAnonymous && <span className="text-xs text-slate-400">(Identidade preservada)</span>}
              </div>
              {!selectedMsg.isAnonymous && (
                <>
                  <div className="flex items-center gap-2 text-xs text-slate-500"><Mail className="h-3.5 w-3.5" />{selectedMsg.email}</div>
                  {selectedMsg.phone && <div className="flex items-center gap-2 text-xs text-slate-500"><Phone className="h-3.5 w-3.5" />{selectedMsg.phone}</div>}
                </>
              )}
              <div className="text-xs text-slate-400 pt-1">{selectedMsg.receivedAt}</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedMsg.message}</p>
            </div>

            {selectedMsg.resolvedAt && (
              <p className="text-xs text-emerald-600 font-semibold">✓ Respondido em {selectedMsg.resolvedAt}</p>
            )}

            <div className="flex gap-3">
              {selectedMsg.status !== 'respondido' && (
                <button
                  onClick={() => handleUpdateStatus(selectedMsg.id, 'respondido')}
                  disabled={updatingId === selectedMsg.id}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-teal px-4 py-3 text-sm font-bold text-white shadow-md shadow-brand-teal/20 hover:bg-brand-teal-dark transition-colors disabled:opacity-60"
                >
                  {updatingId === selectedMsg.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Marcar como Respondido
                </button>
              )}
              {selectedMsg.status !== 'arquivado' && (
                <button
                  onClick={() => handleUpdateStatus(selectedMsg.id, 'arquivado')}
                  disabled={updatingId === selectedMsg.id}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60"
                >
                  <Archive className="h-4 w-4" /> Arquivar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
