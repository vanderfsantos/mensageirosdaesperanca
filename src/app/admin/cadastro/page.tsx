'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Lock,
  Mail,
  User,
  Briefcase,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/ui/Logo';

const CARGOS = [
  'Coordenadora Geral',
  'Coordenadora Pedagógica',
  'Assistente Social',
  'Coordenadora de Projetos',
  'Comunicação e Redes Sociais',
  'Financeiro e Captação',
  'Facilitador(a) de Oficinas',
  'Voluntário(a) Administrativo(a)',
  'Outro',
];

export default function CadastroAdminPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Anti-Bot: Honeypot & Timing
  const [honeypotValue, setHoneypotValue] = useState('');
  const formMountTimeRef = useRef<number>(0);

  // Anti-Bot: Cloudflare Turnstile Token
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    formMountTimeRef.current = Date.now();
  }, []);

  const isSupabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Anti-Bot: Honeypot check (se preenchido, aborta fingindo sucesso)
    if (honeypotValue.trim() !== '') {
      console.warn('Bot detectado via Honeypot.');
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 1000);
      return;
    }

    // 2. Anti-Bot: Tempo mínimo de preenchimento (2 segundos)
    const timeElapsed = Date.now() - formMountTimeRef.current;
    if (timeElapsed < 2000) {
      console.warn('Submissão rápida demais (< 2s). Possível bot.');
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 1000);
      return;
    }

    // 3. Anti-Bot: Turnstile (se chave configurada)
    if (turnstileSiteKey && !turnstileToken) {
      setErrorMessage('Por favor, confirme a verificação de segurança (Turnstile).');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem. Por favor, verifique.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    // Modo Simulação (se sem Supabase configurado)
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 1200);
      return;
    }

    // Cadastro Real no Supabase Auth
    try {
      const supabase = createClient();
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?next=/admin/aguardando-aprovacao`
        : undefined;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            cargo: role || 'Administrador',
            role: 'editor',
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Falha ao solicitar cadastro. Tente novamente.');
        setIsLoading(false);
        turnstileRef.current?.reset();
        return;
      }

      // Importante: Desconecta imediatamente para NÃO autenticar automaticamente
      if (data.session) {
        await supabase.auth.signOut();
      }

      setIsLoading(false);
      setIsSuccess(true);
    } catch (err) {
      console.error('Cadastro: Erro inesperado', err);
      setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
      setIsLoading(false);
      turnstileRef.current?.reset();
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
          <div className="inline-flex items-center gap-1 bg-brand-teal-light text-brand-teal px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-brand-orange animate-pulse" /> Novo Operador
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Solicitar Acesso
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Preencha seus dados para solicitar autorização ao painel da OSC.
          </p>
        </div>

        {/* Mensagem de Erro */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 items-start animate-fade-in">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-800 font-bold leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* TELA DE SUCESSO: Cadastro Enviado para Análise */}
        {isSuccess ? (
          <div className="space-y-6 text-center py-4 animate-fade-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-inner">
              <Clock className="h-8 w-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-800">
                Cadastro Enviado para Análise!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                Aguarde a aprovação de um <strong>administrador da Mensageiros da Esperança</strong>.
                Assim que sua solicitação for liberada, você poderá acessar o painel com seu e-mail e senha.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <ShieldCheck className="h-4 w-4 text-primary" /> Política de Segurança
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Por motivos de conformidade legal e proteção de dados dos beneficiários, todos os operadores passam por triagem prévia.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/login"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary-hover transition-all"
              >
                Voltar para a Página de Login
              </Link>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO COM PROTEÇÃO ANTI-BOT */
          <form onSubmit={handleCadastro} className="space-y-4">

            {/* HONEYPOT INVISÍVEL (Anti-Bot) */}
            <div
              aria-hidden="true"
              style={{
                opacity: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                height: 0,
                width: 0,
                zIndex: -1,
                pointerEvents: 'none',
                overflow: 'hidden',
              }}
            >
              <label htmlFor="institution_code_confirm">Não preencha este campo</label>
              <input
                type="text"
                id="institution_code_confirm"
                name="institution_code_confirm"
                tabIndex={-1}
                autoComplete="off"
                value={honeypotValue}
                onChange={(e) => setHoneypotValue(e.target.value)}
              />
            </div>

            {/* Nome Completo */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Nome Completo *
              </label>
              <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full pl-11 pr-4 py-3.5 text-sm text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* E-mail */}
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
                  className="w-full pl-11 pr-4 py-3.5 text-sm text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Cargo / Área */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Cargo Solicitado / Área de Atuação *
              </label>
              <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Briefcase className="h-4 w-4" />
                </span>
                <select
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 text-sm text-slate-700 bg-transparent focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="" disabled>Selecione seu cargo ou área...</option>
                  {CARGOS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Senha *
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
            </div>

            {/* Confirmação de Senha */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Confirmar Senha *
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
                  placeholder="Repita a senha"
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
            </div>

            {/* Cloudflare Turnstile Widget (se chave configurada) */}
            {turnstileSiteKey && (
              <div className="pt-2 flex justify-center">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={turnstileSiteKey}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => setTurnstileToken(null)}
                  onExpire={() => setTurnstileToken(null)}
                  options={{
                    theme: 'light',
                    size: 'flexible',
                  }}
                />
              </div>
            )}

            {/* Botão Enviar Solicitação */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-4 text-sm font-bold text-white shadow-md shadow-secondary/20 hover:bg-secondary-hover active:scale-[0.98] transition-all focus:outline-none disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando Solicitação...
                  </>
                ) : (
                  'Solicitar Cadastro de Operador'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Link de retorno */}
        {!isSuccess && (
          <div className="text-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Já tem uma conta aprovada? Fazer Login
            </Link>
          </div>
        )}

        {/* Aviso Modo Simulação */}
        {!isSupabaseConfigured && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              🔧 Supabase não configurado. Operando em Modo Simulação com Proteção Anti-Bot Ativa.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
