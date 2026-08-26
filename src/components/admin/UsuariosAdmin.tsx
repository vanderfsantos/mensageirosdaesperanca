'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Edit, Trash2, Shield, UserCheck, Mail,
  AlertTriangle, Loader2, X, Save, CheckCircle2, Clock, Ban, ChevronLeft, ChevronRight,
  Briefcase, Check, XCircle, ShieldAlert, UserPlus, Users
} from 'lucide-react';
import { AdminProfile } from '@/types';
import {
  saveAdminUserAction,
  toggleAdminUserStatusAction,
  deleteAdminUserAction,
  approveAdminUserAction,
  rejectAdminUserAction,
} from '@/app/admin/usuarios/actions';

const ROLE_CONFIG: Record<string, { label: string; color: string; desc: string }> = {
  admin: {
    label: 'Administrador Geral',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    desc: 'Acesso total e gerenciamento de permissões',
  },
  editor: {
    label: 'Editor de Conteúdo',
    color: 'bg-brand-teal-light text-brand-teal border-brand-teal/20',
    desc: 'Criação e edição de cursos, notícias e histórias',
  },
  comunicacao: {
    label: 'Comunicação e Redes',
    color: 'bg-brand-orange-light text-brand-orange border-brand-orange/20',
    desc: 'Gestão de notícias e respostas a contatos',
  },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active: { label: 'Ativo', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  ativo: { label: 'Ativo', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  pending: { label: 'Pendente', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  convidado: { label: 'Convite', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Mail },
  rejected: { label: 'Recusado', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle },
  blocked: { label: 'Bloqueado', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: Ban },
  inativo: { label: 'Inativo', color: 'bg-slate-100 text-slate-500 border-slate-200', icon: Ban },
};

const EMPTY_USER = {
  fullName: '',
  email: '',
  cargo: '',
  role: 'editor' as AdminProfile['role'],
  status: 'active' as AdminProfile['status'],
  password: '',
};

export default function UsuariosAdmin({
  initialUsers,
  currentUserRole = 'admin',
}: {
  initialUsers: AdminProfile[];
  currentUserRole?: 'admin' | 'editor' | 'comunicacao';
}) {
  const [users, setUsers] = useState<AdminProfile[]>(initialUsers);
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal de Criação / Edição
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminProfile | null>(null);
  const [form, setForm] = useState(EMPTY_USER);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal de Aprovação de Solicitação Pendente
  const [approvingUser, setApprovingUser] = useState<AdminProfile | null>(null);
  const [selectedApprovalRole, setSelectedApprovalRole] = useState<'admin' | 'editor' | 'comunicacao'>('editor');
  const [isApproving, setIsApproving] = useState(false);

  // Modal de Exclusão / Rejeição
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [rejectingUser, setRejectingUser] = useState<AdminProfile | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  const isAdmin = currentUserRole === 'admin';

  // Contadores
  const pendingUsers = useMemo(() => users.filter((u) => u.status === 'pending'), [users]);
  const activeUsers = useMemo(
    () => users.filter((u) => u.status !== 'pending'),
    [users]
  );

  // Usuários filtrados conforme a aba ativa
  const currentTabUsers = activeTab === 'pending' ? pendingUsers : activeUsers;

  const filtered = useMemo(() => {
    return currentTabUsers.filter((u) => {
      const matchSearch =
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.cargo && u.cargo.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [currentTabUsers, searchTerm, roleFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const openAdd = () => {
    setEditingUser(null);
    setForm(EMPTY_USER);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (u: AdminProfile) => {
    setEditingUser(u);
    setForm({
      fullName: u.fullName,
      email: u.email,
      cargo: u.cargo || '',
      role: u.role,
      status: u.status,
      password: '',
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    setFormError(null);
    if (!form.fullName.trim()) {
      setFormError('O nome completo é obrigatório.');
      return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      setFormError('Informe um e-mail válido.');
      return;
    }

    setIsSaving(true);
    try {
      await saveAdminUserAction({
        id: editingUser?.id,
        fullName: form.fullName,
        email: form.email,
        cargo: form.cargo,
        role: form.role,
        status: form.status,
        password: form.password || undefined,
      });

      if (editingUser) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? {
                  ...u,
                  fullName: form.fullName,
                  email: form.email,
                  cargo: form.cargo,
                  role: form.role,
                  status: form.status,
                }
              : u
          )
        );
      } else {
        const newUser: AdminProfile = {
          id: `usr-${Date.now()}`,
          fullName: form.fullName,
          email: form.email,
          cargo: form.cargo || 'Administrador',
          role: form.role,
          status: form.status,
          createdAt: new Date()
            .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
            .replace('.', ''),
        };
        setUsers((prev) => [newUser, ...prev]);
      }
      setShowModal(false);
    } catch {
      setFormError('Erro ao salvar administrador. Verifique suas permissões.');
    } finally {
      setIsSaving(false);
    }
  };

  // APROVAÇÃO
  const handleApprove = async () => {
    if (!approvingUser) return;
    setIsApproving(true);
    try {
      await approveAdminUserAction(approvingUser.id, selectedApprovalRole);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === approvingUser.id
            ? { ...u, status: 'active', role: selectedApprovalRole }
            : u
        )
      );
      setApprovingUser(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao aprovar operador.');
    } finally {
      setIsApproving(false);
    }
  };

  // REJEIÇÃO
  const handleReject = async () => {
    if (!rejectingUser) return;
    setIsRejecting(true);
    try {
      await rejectAdminUserAction(rejectingUser.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === rejectingUser.id ? { ...u, status: 'rejected' } : u
        )
      );
      setRejectingUser(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao recusar operador.');
    } finally {
      setIsRejecting(false);
    }
  };

  const handleToggleStatus = async (id: string, current: AdminProfile['status']) => {
    const next: AdminProfile['status'] =
      current === 'active' || current === 'ativo' ? 'blocked' : 'active';
    try {
      await toggleAdminUserStatusAction(id, next);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: next } : u)));
    } catch {
      alert('Erro ao alterar status.');
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteAdminUserAction(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert('Erro ao excluir usuário.');
    } finally {
      setDeletingId(null);
      setIsDeleting(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all';
  const labelClass = 'text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5';

  return (
    <div className="space-y-6">

      {/* Aviso de Perfil (se não for admin geral) */}
      {!isAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900 font-medium">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
          <span>
            Você está conectado como <strong>{currentUserRole}</strong>. Apenas <strong>Administradores Gerais</strong> possuem permissão para aprovar novas solicitações ou alterar níveis de acesso.
          </span>
        </div>
      )}

      {/* ABAS DE NAVEGAÇÃO */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          {/* Aba Ativos */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('active');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="h-4 w-4" />
            Operadores Ativos ({activeUsers.length})
          </button>

          {/* Aba Pendentes com Badge Contador */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('pending');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="h-4 w-4" />
            Solicitações Pendentes
            {pendingUsers.length > 0 && (
              <span
                className={`ml-1.5 px-2 py-0.5 rounded-full text-xs font-black transition-all ${
                  activeTab === 'pending'
                    ? 'bg-white text-amber-700'
                    : 'bg-amber-500 text-white animate-pulse'
                }`}
              >
                {pendingUsers.length}
              </span>
            )}
          </button>
        </div>

        {/* Botão Novo Operador */}
        {isAdmin && activeTab === 'active' && (
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-secondary-hover transition-colors whitespace-nowrap cursor-pointer"
          >
            <UserPlus className="h-4 w-4" /> Convidar / Cadastrar Operador
          </button>
        )}
      </div>

      {/* Controles de busca e filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'pending'
                ? 'Buscar por nome, e-mail ou cargo solicitado...'
                : 'Buscar operadores por nome ou e-mail...'
            }
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {activeTab === 'active' && (
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="all">Todas as funções</option>
            <option value="admin">Administrador Geral</option>
            <option value="editor">Editor de Conteúdo</option>
            <option value="comunicacao">Comunicação</option>
          </select>
        )}
      </div>

      {/* =========================================================================
          ABA 1: SOLICITAÇÕES PENDENTES DE APROVAÇÃO
          ========================================================================= */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {paginated.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 space-y-3 shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-700">Tudo em dia!</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Não há nenhuma solicitação de novo operador pendente de análise no momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-4 relative overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Cabeçalho do Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm shrink-0 border border-amber-200">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">{user.fullName}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {user.email}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                      <Clock className="h-3 w-3" /> Pendente
                    </span>
                  </div>

                  {/* Informações Solicitadas */}
                  <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Cargo Solicitado:</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-primary" />
                        {user.cargo || 'Não especificado'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Data do Pedido:</span>
                      <span className="font-medium text-slate-600">{user.createdAt}</span>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  {isAdmin ? (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setApprovingUser(user);
                          setSelectedApprovalRole('editor');
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
                      >
                        <Check className="h-3.5 w-3.5" /> Aprovar Acesso
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejectingUser(user)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-2 text-xs font-bold transition-all cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" /> Recusar
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-center text-slate-400 italic">
                      Aprovação restrita a Administradores Gerais.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          ABA 2: OPERADORES ATIVOS & GERENCIAMENTO
          ========================================================================= */}
      {activeTab === 'active' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {paginated.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <UserCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">Nenhum operador encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-5 py-3.5">
                      Operador
                    </th>
                    <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden md:table-cell">
                      Função / Permissão
                    </th>
                    <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden lg:table-cell">
                      Cargo / Área
                    </th>
                    <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5">
                      Status
                    </th>
                    <th className="px-4 py-3.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((user) => {
                    const StatusIcon = STATUS_CONFIG[user.status]?.icon || CheckCircle2;
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 flex items-center gap-2">
                                {user.fullName}
                                {user.role === 'admin' && (
                                  <span title="Administrador Geral">
                                    <Shield className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-slate-400 flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                              ROLE_CONFIG[user.role]?.color ?? 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {ROLE_CONFIG[user.role]?.label ?? user.role}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-600 text-xs hidden lg:table-cell">
                          {user.cargo || 'Administrador'}
                        </td>
                        <td className="px-4 py-4">
                          {isAdmin ? (
                            <button
                              onClick={() => handleToggleStatus(user.id, user.status)}
                              title="Clique para alternar status (Ativo / Bloqueado)"
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border transition-all hover:opacity-80 cursor-pointer ${
                                STATUS_CONFIG[user.status]?.color ?? 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {STATUS_CONFIG[user.status]?.label ?? user.status}
                            </button>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                                STATUS_CONFIG[user.status]?.color ?? 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {STATUS_CONFIG[user.status]?.label ?? user.status}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {isAdmin && (
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEdit(user)}
                                className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                                title="Editar Perfil"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeletingId(user.id)}
                                className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Excluir Administrador"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{filtered.length} operadores</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-semibold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: APROVAR SOLICITAÇÃO PENDENTE
          ========================================================================= */}
      {approvingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-lg">Aprovar Operador</h3>
                <p className="text-xs text-slate-400">
                  Defina a função e libere o acesso de <strong>{approvingUser.fullName}</strong>.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
              <p><strong className="text-slate-700">E-mail:</strong> {approvingUser.email}</p>
              <p><strong className="text-slate-700">Cargo Informado:</strong> {approvingUser.cargo || 'Administrador'}</p>
              <p><strong className="text-slate-700">Data do Pedido:</strong> {approvingUser.createdAt}</p>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Selecione o Nível de Acesso *</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { key: 'editor', title: 'Editor de Conteúdo', desc: 'Edita cursos, notícias e histórias' },
                  { key: 'comunicacao', title: 'Comunicação', desc: 'Responde contatos e publica artigos' },
                  { key: 'admin', title: 'Administrador Geral', desc: 'Acesso total e gestão de acessos' },
                ].map((opt) => (
                  <label
                    key={opt.key}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedApprovalRole === opt.key
                        ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="approval_role"
                      value={opt.key}
                      checked={selectedApprovalRole === opt.key}
                      onChange={() => setSelectedApprovalRole(opt.key as any)}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{opt.title}</p>
                      <p className="text-[11px] text-slate-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setApprovingUser(null)}
                disabled={isApproving}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={isApproving}
                className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {isApproving ? 'Liberando...' : 'Confirmar Aprovação'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: RECUSAR SOLICITAÇÃO
          ========================================================================= */}
      {rejectingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-800">Recusar Solicitação?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  O operador <strong>{rejectingUser.fullName}</strong> terá o acesso negado ao tentar logar.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRejectingUser(null)}
                disabled={isRejecting}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isRejecting}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Recusar Acesso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: FORMULÁRIO DE CRIAÇÃO / EDIÇÃO
          ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">
                    {editingUser ? 'Editar Operador' : 'Convidar / Cadastrar Operador'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Defina as permissões de acesso e dados institucionais
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold flex gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {formError}
              </div>
            )}

            <div className="space-y-3.5">
              <div>
                <label className={labelClass}>Nome Completo *</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Ex: Carlos Eduardo Silva"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>E-mail Institucional *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="carlos@mensageirosdaesperanca.org"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Cargo / Área de Atuação</label>
                <input
                  type="text"
                  value={form.cargo}
                  onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                  placeholder="Ex: Coordenadora Pedagógica"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Função / Permissão *</label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value as AdminProfile['role'] })
                    }
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="admin">Administrador Geral</option>
                    <option value="editor">Editor de Conteúdo</option>
                    <option value="comunicacao">Comunicação</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Status de Acesso</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as AdminProfile['status'] })
                    }
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="active">Ativo (Aprovado)</option>
                    <option value="pending">Pendente de Análise</option>
                    <option value="blocked">Bloqueado</option>
                    <option value="rejected">Recusado</option>
                  </select>
                </div>
              </div>

              {!editingUser && (
                <div>
                  <label className={labelClass}>Senha Provisória (Opcional)</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres (se aplicável)"
                    className={inputClass}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Se vazio, o usuário receberá link de definição de senha no primeiro acesso.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 rounded-xl bg-brand-orange py-3 text-sm font-bold text-white shadow-md shadow-brand-orange/20 hover:bg-brand-orange-dark disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EXCLUIR OPERADOR
          ========================================================================= */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-800">Remover operador?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  O usuário perderá o acesso a todos os módulos administrativos.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingId)}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
