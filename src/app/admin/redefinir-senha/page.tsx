'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/ui/Logo';

function RedefinirSenhaContent() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Indicador visual de força de senha
  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { label: '', color: '' };
    if (pwd.length < 6) return { label: 'Muito fraca', color: 'text-rose-500' };
    if (pwd.length < 8) return { label: 'Fraca', color: 'text-orange-500' };
    if (pwd.length < 12) return { label: 'Média', color: 'text-amber-500' };
    return { label: 'Forte', color: 'text-emerald-600' };
  };

  const strength = getPasswordStrength(password);

  useEffect(() => {
    const isSupabaseConfigured =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!isSupabaseConfigured) {
      setReady(true);
      return;
    }

    const code = searchParams.get('code');

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) {
          setReady(true);
        } else {
          setMessage({
            type: 'error',
            text: 'Link de recuperação expirado ou inválido. Por favor, solicite um novo link.',
          });
        }
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setReady(true);
      }
    });

    // Se já houver sessão ativa
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [searchParams, supabase]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas digitadas não coincidem. Por favor, verifique.' });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'A nova senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const isSupabaseConfigured =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setLoading(false);
        setMessage({ type: 'success', text: 'Senha atualizada com sucesso (Modo Simulação)! Redirecionando...' });
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      }, 1000);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMessage({ type: 'error', text: error.message || 'Erro ao redefinir a senha.' });
    } else {
      setMessage({
        type: 'success',
        text: 'Senha atualizada com sucesso! Redirecionando para o login...',
      });
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-bg px-4 py-12">
      <div className="w-full max-w-md space-y-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md">

        {/* Identidade Visual */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="inline-block focus:outline-none" title="Voltar ao site">
            <Logo variant="default" priority />
          </Link>
          <div className="inline-flex items-center gap-1.5 bg-brand-teal-light text-brand-teal px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-teal" /> Segurança & Acesso
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Redefinir Senha
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            Cadastre sua nova senha de acesso institucional.
          </p>
        </div>

        {/* Mensagens de Alerta / Confirmação */}
        {message && (
          <div
            className={`p-4 rounded-2xl flex gap-3 items-start animate-fade-in border ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            )}
            <p className="text-xs font-bold leading-relaxed">{message.text}</p>
          </div>
        )}

        {/* Validação de Código de Segurança */}
        {!ready && !message && (
          <div className="py-8 flex flex-col items-center justify-center gap-3 text-center text-slate-500 animate-pulse">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs font-semibold text-slate-600">
              Validando código de segurança...
            </p>
          </div>
        )}

        {/* Se houver erro de token expirado */}
        {message?.type === 'error' && !ready && (
          <div className="pt-2">
            <Link
              href="/admin/esqueci-senha"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary-hover transition-all"
            >
              <RotateCcw className="h-4 w-4" /> Solicitar Novo Link
            </Link>
          </div>
        )}

        {/* Formulário de Redefinição */}
        {ready && (!message || message.type !== 'success') && (
          <form onSubmit={handleReset} className="space-y-4 animate-fade-in">

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
                  className="w-full pl-11 pr-12 py-3.5 text-sm text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {strength.label && (
                <p className={`text-[10px] font-bold ${strength.color} pl-1`}>
                  Força da senha: {strength.label}
                </p>
              )}
            </div>

            {/* Confirmar Nova Senha */}
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
                  placeholder="Repita sua nova senha"
                  className="w-full pl-11 pr-12 py-3.5 text-sm text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p
                  className={`text-[10px] font-bold pl-1 ${
                    password === confirmPassword ? 'text-emerald-600' : 'text-rose-500'
                  }`}
                >
                  {password === confirmPassword ? '✓ As senhas coincidem' : '✗ As senhas não coincidem'}
                </p>
              )}
            </div>

            {/* Botão Submeter */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#E85D36] hover:bg-[#D04A23] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#E85D36]/20 active:scale-[0.98] transition-all focus:outline-none disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando nova senha...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    Salvar Nova Senha
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Link de Retorno */}
        <div className="text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para o Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RedefinirSenhaContent />
    </Suspense>
  );
}
