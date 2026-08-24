'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Indicador visual de força de senha
  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { label: '', color: '' };
    if (pwd.length < 6) return { label: 'Muito fraca', color: 'text-rose-500' };
    if (pwd.length < 8) return { label: 'Fraca', color: 'text-orange-500' };
    if (pwd.length < 12) return { label: 'Média', color: 'text-amber-500' };
    return { label: 'Forte', color: 'text-emerald-600' };
  };

  const strength = getPasswordStrength(password);

  const handleRedefinir = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem. Por favor, verifique.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    const isSupabaseConfigured =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Modo Simulação
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setSuccess(true);
        setIsLoading(false);
        setTimeout(() => router.push('/admin'), 3000);
      }, 1000);
      return;
    }

    // Supabase: atualiza senha do usuário autenticado via magic link
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMessage(
          error.message ||
          'Falha ao redefinir a senha. O link pode ter expirado — solicite um novo.'
        );
        setIsLoading(false);
      } else {
        setSuccess(true);
        setIsLoading(false);
        setTimeout(() => router.push('/admin'), 3000);
      }
    } catch (err) {
      console.error('Redefinir-senha: Erro inesperado', err);
      setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-bg px-4 py-12">
      <div className="w-full max-w-md space-y-7 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md">

        {/* Identidade Visual */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mx-auto">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Nova Senha
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            Escolha uma nova senha segura para sua conta administrativa.
          </p>
        </div>

        {/* Mensagem de Erro */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 items-start">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-800 font-bold leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Estado: Sucesso */}
        {success ? (
          <div className="space-y-5">
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex gap-3 items-start">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-emerald-800">Senha redefinida com sucesso!</p>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                  Redirecionando para o painel de controle em instantes...
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Formulário */
          <form onSubmit={handleRedefinir} className="space-y-4">

            {/* Nova Senha */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Nova Senha *
              </label>
              <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-11 pr-12 py-4 text-sm text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Indicador de força */}
              {strength.label && (
                <p className={`text-[10px] font-bold ${strength.color} pl-1`}>
                  Força da senha: {strength.label}
                </p>
              )}
            </div>

            {/* Confirmação de Senha */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Confirmar Nova Senha *
              </label>
              <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full pl-11 pr-12 py-4 text-sm text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Indicador de match */}
              {confirmPassword.length > 0 && (
                <p className={`text-[10px] font-bold pl-1 ${password === confirmPassword ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {password === confirmPassword ? '✓ As senhas coincidem' : '✗ As senhas não coincidem'}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary-hover active:scale-[0.98] transition-all focus:outline-none disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando nova senha...
                  </>
                ) : (
                  'Redefinir Senha e Acessar Painel'
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
