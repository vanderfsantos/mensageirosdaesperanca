'use client';

import React, { useState } from 'react';
import { UserCheck, X, AlertTriangle, Loader2, Save, Eye, EyeOff } from 'lucide-react';
import { AdminProfile } from '@/types';
import { updateUserAdmin } from '@/app/admin/usuarios/actions';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminProfile | null;
  onSuccess: (updatedUser: AdminProfile) => void;
}

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: EditUserModalProps) {
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [cargo, setCargo] = useState(user?.cargo || '');
  const [role, setRole] = useState<AdminProfile['role']>(user?.role || 'editor');
  const [status, setStatus] = useState<AdminProfile['status']>(user?.status || 'active');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('O nome completo é obrigatório.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Informe um e-mail institucional válido.');
      return;
    }

    setIsSaving(true);

    try {
      const res = await updateUserAdmin(user.id, {
        fullName: fullName.trim(),
        email: email.trim(),
        cargo: cargo.trim(),
        role,
        status,
        password: password.trim() ? password.trim() : undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Falha ao atualizar operador.');
        setIsSaving(false);
        return;
      }

      onSuccess({
        ...user,
        fullName: fullName.trim(),
        email: email.trim(),
        cargo: cargo.trim(),
        role,
        status,
      });

      setIsSaving(false);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro ao processar atualização.');
      setIsSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all';
  const labelClass = 'text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5';

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-scale-up">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">
                Editar Operador
              </h3>
              <p className="text-xs text-slate-400">
                Sincroniza permissões no Auth e no Perfil
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Alerta de Erro */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold flex gap-2 items-start animate-fade-in">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3.5">
          {/* Nome */}
          <div>
            <label className={labelClass}>Nome Completo *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nome do operador"
              className={inputClass}
            />
          </div>

          {/* E-mail */}
          <div>
            <label className={labelClass}>E-mail Institucional *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@mensageirosdaesperanca.org"
              className={inputClass}
            />
          </div>

          {/* Cargo */}
          <div>
            <label className={labelClass}>Cargo / Área de Atuação</label>
            <input
              type="text"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              placeholder="Ex: Coordenadora Pedagógica"
              className={inputClass}
            />
          </div>

          {/* Nível e Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Função / Permissão *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminProfile['role'])}
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
                value={status}
                onChange={(e) => setStatus(e.target.value as AdminProfile['status'])}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="active">Ativo (Aprovado)</option>
                <option value="pending">Pendente de Análise</option>
                <option value="blocked">Bloqueado</option>
                <option value="rejected">Recusado</option>
              </select>
            </div>
          </div>

          {/* Nova Senha */}
          <div>
            <label className={labelClass}>Nova Senha / Senha Provisória (Opcional)</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Deixe em branco para manter a atual (mínimo 6 caracteres)"
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Define uma nova senha provisória de acesso imediato sem depender de envio de e-mails.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-xl bg-brand-orange py-3 text-sm font-bold text-white shadow-md shadow-brand-orange/20 hover:bg-brand-orange-dark disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
