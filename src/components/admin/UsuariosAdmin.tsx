'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Edit, Trash2, Shield, UserCheck, Mail,
  AlertTriangle, Loader2, X, Save, CheckCircle2, Clock, Ban, ChevronLeft, ChevronRight
} from 'lucide-react';
import { AdminProfile } from '@/types';
import { saveAdminUserAction, toggleAdminUserStatusAction, deleteAdminUserAction } from '@/app/admin/usuarios/actions';

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
  ativo: { label: 'Ativo', color: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  convidado: { label: 'Convite Pendente', color: 'bg-amber-50 text-amber-700', icon: Clock },
  inativo: { label: 'Inativo', color: 'bg-slate-100 text-slate-500', icon: Ban },
};

const EMPTY_USER = {
  fullName: '',
  email: '',
  role: 'editor' as AdminProfile['role'],
  status: 'ativo' as AdminProfile['status'],
  password: '',
};

export default function UsuariosAdmin({ initialUsers }: { initialUsers: AdminProfile[] }) {
  const [users, setUsers] = useState<AdminProfile[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminProfile | null>(null);
  const [form, setForm] = useState(EMPTY_USER);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Exclusão
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

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
        role: form.role,
        status: form.status,
        password: form.password || undefined,
      });

      if (editingUser) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? { ...u, fullName: form.fullName, email: form.email, role: form.role, status: form.status }
              : u
          )
        );
      } else {
        const newUser: AdminProfile = {
          id: `usr-${Date.now()}`,
          fullName: form.fullName,
          email: form.email,
          role: form.role,
          status: form.status,
          createdAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
        };
        setUsers((prev) => [newUser, ...prev]);
      }
      setShowModal(false);
    } catch {
      setFormError('Erro ao salvar administrador. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (id: string, current: AdminProfile['status']) => {
    const next: AdminProfile['status'] = current === 'ativo' ? 'inativo' : 'ativo';
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
    <div className="space-y-4">
      {/* Controles de busca e filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Todas as funções</option>
          <option value="admin">Administrador Geral</option>
          <option value="editor">Editor de Conteúdo</option>
          <option value="comunicacao">Comunicação</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="convidado">Convite Pendente</option>
          <option value="inativo">Inativo</option>
        </select>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-secondary-hover transition-colors whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> Convidar / Cadastrar Novo Administrador
        </button>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <UserCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Nenhum administrador encontrado.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-5 py-3.5">
                  Administrador
                </th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden md:table-cell">
                  Função / Acesso
                </th>
                <th className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3.5 hidden lg:table-cell">
                  Cadastro
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
                    <td className="px-4 py-4 text-slate-400 text-xs hidden lg:table-cell">
                      {user.createdAt}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        title="Clique para alternar status"
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold transition-all hover:opacity-80 ${
                          STATUS_CONFIG[user.status]?.color ?? 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {STATUS_CONFIG[user.status]?.label ?? user.status}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(user)}
                          className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors"
                          title="Editar Perfil"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(user.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Excluir Administrador"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{filtered.length} administradores</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-semibold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Formulário de Criação/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">
                    {editingUser ? 'Editar Administrador' : 'Convidar / Cadastrar Administrador'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Defina as permissões de acesso e dados institucionais
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Função / Permissão *</label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value as AdminProfile['role'] })
                    }
                    className={inputClass}
                  >
                    <option value="admin">Administrador Geral</option>
                    <option value="editor">Editor de Conteúdo</option>
                    <option value="comunicacao">Comunicação</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as AdminProfile['status'] })
                    }
                    className={inputClass}
                  >
                    <option value="ativo">Ativo</option>
                    <option value="convidado">Convite Pendente</option>
                    <option value="inativo">Inativo</option>
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
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 rounded-xl bg-brand-orange py-3 text-sm font-bold text-white shadow-md shadow-brand-orange/20 hover:bg-brand-orange-dark disabled:opacity-60 flex items-center justify-center gap-2"
              >
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
              <div className="h-11 w-11 rounded-2xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-800">Remover administrador?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  O usuário perderá o acesso a todos os módulos administrativos.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-60 flex items-center justify-center gap-2"
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
