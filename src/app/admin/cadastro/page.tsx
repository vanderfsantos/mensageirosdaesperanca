'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSupabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem. Por favor, verifique.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    // Modo Simulação
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setSuccessMessage(
          'Conta criada com sucesso (Modo Simulação)! Redirecionando para o painel...'
        );
        setTimeout(() => router.push('/admin'), 2000);
      }, 1000);
      return;
    }

    // Cadastro Real no Supabase Auth
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Falha ao criar conta. Tente novamente.');
        setIsLoading(false);
      } else {
        setSuccessMessage(
          'Conta criada! Verifique seu e-mail para confirmar o cadastro antes de acessar o painel.'
        );
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Cadastro: Erro inesperado', err);
      setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-bg px-4 py-12">
      <div className="w-full max-w-md space-y-7 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md">

        {/* Identidade Visual */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" /> Novo Administrador
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Criar Conta
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Preencha os dados para solicitar acesso ao painel da OSC.
          </p>
        </div>

        {/* Mensagem de Erro */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 items-start">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-800 font-bold leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Mensagem de Sucesso */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex gap-3 items-start">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-800 font-bold leading-relaxed">{successMessage}</p>
          </div>
        )}

        {/* Formulário */}
        {!successMessage && (
          <form onSubmit={handleCadastro} className="space-y-4">

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
                  className="w-full pl-11 pr-4 py-4 text-sm text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none"
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
                  className="w-full pl-11 pr-4 py-4 text-sm text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Cargo */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Cargo / Área de Atuação *
              </label>
              <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Briefcase className="h-4 w-4" />
                </span>
                <select
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 text-sm text-slate-700 bg-transparent focus:outline-none appearance-none cursor-pointer"
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
            </div>

            {/* Botão Criar Conta */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-4 text-sm font-bold text-white shadow-md shadow-secondary/20 hover:bg-secondary-hover active:scale-[0.98] transition-all focus:outline-none disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar Conta de Administrador'
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
            Já tem uma conta? Fazer Login
          </Link>
        </div>

        {/* Aviso Modo Simulação */}
        {!isSupabaseConfigured && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              🔧 Supabase não configurado. Operando em Modo Simulação.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
