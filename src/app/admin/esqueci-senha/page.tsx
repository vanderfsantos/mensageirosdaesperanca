'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/ui/Logo';

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const isSupabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    // Modo Simulação
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setSent(true);
        setIsLoading(false);
      }, 1000);
      return;
    }

    // Supabase: envia e-mail de recuperação
    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/admin/redefinir-senha`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMessage(error.message || 'Falha ao enviar o link de recuperação.');
        setIsLoading(false);
      } else {
        setSent(true);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Esqueci-senha: Erro inesperado', err);
      setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-bg px-4 py-12">
      <div className="w-full max-w-md space-y-7 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md">

        {/* Identidade Visual */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="inline-block focus:outline-none" title="Voltar ao site">
            <Logo variant="default" priority />
          </Link>
          <div className="inline-flex items-center gap-1.5 bg-brand-teal-light text-brand-teal px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <KeyRound className="h-3.5 w-3.5 text-brand-orange" /> Recuperação de Acesso
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Esqueci Minha Senha
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
            Informe o e-mail cadastrado e enviaremos um link seguro para você redefinir sua senha.
          </p>
        </div>


        {/* Mensagem de Erro */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 items-start">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-800 font-bold leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Estado: Link Enviado */}
        {sent ? (
          <div className="space-y-5">
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex gap-3 items-start">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-emerald-800">Link enviado com sucesso!</p>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                  Verifique sua caixa de entrada (e a pasta de spam) no endereço{' '}
                  <strong>{email}</strong>. O link expira em 1 hora.
                </p>
              </div>
            </div>
            {!isSupabaseConfigured && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  🔧 Modo Simulação ativo — nenhum e-mail real foi enviado.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Formulário */
          <form onSubmit={handleResetRequest} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                E-mail Institucional *
              </label>
              <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@mensageirosdaesperanca.org"
                  className="w-full pl-11 pr-4 py-4 text-sm text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none"
                />
              </div>
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
                    Enviando link...
                  </>
                ) : (
                  'Enviar Link de Recuperação'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Link de retorno */}
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
