'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { 
  Lock, 
  Mail, 
  Loader2, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/ui/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningType, setWarningType] = useState<'pending' | 'blocked' | 'error' | null>(null);

  useEffect(() => {
    // Detecta mensagens passadas por query string
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const errorParam = params.get('error');
      if (errorParam === 'pending') {
        setErrorMessage('Sua conta aguarda autorização de um administrador da instituição.');
        setWarningType('pending');
      } else if (errorParam === 'blocked' || errorParam === 'rejected') {
        setErrorMessage('Acesso negado. Entre em contato com a diretoria.');
        setWarningType('blocked');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setWarningType(null);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // Modo de Simulação (Mock Auth) se as chaves do Supabase não existirem
    if (!supabaseUrl || !supabaseAnonKey) {
      setTimeout(() => {
        if (email.trim() === 'admin@mensageiros.org' && password === 'admin123') {
          // Define cookie de simulação válido por 24 horas
          document.cookie = 'mock-session=admin_mensageiros_session; path=/; max-age=86400; SameSite=Lax';
          router.push('/admin');
          router.refresh();
        } else if (email.trim() === 'pendente@mensageiros.org') {
          setErrorMessage('Sua conta aguarda autorização de um administrador da instituição.');
          setWarningType('pending');
          setIsLoading(false);
        } else {
          setErrorMessage('E-mail ou senha administrativa incorretos (Modo Simulação).');
          setWarningType('error');
          setIsLoading(false);
        }
      }, 1000);
      return;
    }

    // Login Real no Supabase Auth com Verificação de Status
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message || 'Falha ao autenticar.');
        setWarningType('error');
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Consulta o status do profile na tabela public.profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('status, role, full_name')
          .eq('id', data.user.id)
          .maybeSingle();

        const userStatus = profile?.status?.toLowerCase() || 'pending';

        // 1. Status PENDENTE: Desconecta e avisa
        if (userStatus === 'pending') {
          await supabase.auth.signOut();
          setErrorMessage('Sua conta aguarda autorização de um administrador da instituição.');
          setWarningType('pending');
          setIsLoading(false);
          return;
        }

        // 2. Status REJEITADO ou BLOQUEADO: Desconecta e avisa
        if (userStatus === 'rejected' || userStatus === 'blocked' || userStatus === 'inativo') {
          await supabase.auth.signOut();
          setErrorMessage('Acesso negado. Entre em contato com a diretoria.');
          setWarningType('blocked');
          setIsLoading(false);
          return;
        }

        // 3. Status ATIVO: Redireciona para o painel
        if (userStatus === 'active' || userStatus === 'ativo' || userStatus === 'convidado') {
          router.push('/admin');
          router.refresh();
          return;
        }
      }

      // Caso não caia em nenhum status conhecido
      router.push('/admin');
      router.refresh();
    } catch (err) {
      console.error('Login: Erro inesperado ao autenticar', err);
      setErrorMessage('Ocorreu um erro inesperado ao conectar ao servidor.');
      setWarningType('error');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gray-light px-4 py-12">
      <div className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-lg">
        
        {/* Logotipo Oficial Centralizado */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="inline-block focus:outline-none" title="Voltar ao site">
            <Logo variant="default" priority />
          </Link>
          <div className="inline-flex items-center gap-1.5 bg-brand-teal-light text-brand-teal px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-brand-orange animate-pulse" /> Painel de Controle
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Área restrita a operadores e administradores autorizados.
          </p>
        </div>

        {/* Mensagem de Erro / Alerta de Status */}
        {errorMessage && (
          <div
            className={`p-4 rounded-2xl flex gap-3 items-start animate-fade-in border ${
              warningType === 'pending'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : warningType === 'blocked'
                ? 'bg-purple-50 border-purple-200 text-purple-900'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {warningType === 'pending' ? (
              <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            ) : warningType === 'blocked' ? (
              <ShieldAlert className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            )}
            <p className="text-xs font-bold leading-relaxed">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Campo E-mail */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              E-mail Administrativo
            </label>
            <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-brand-teal focus-within:bg-white transition-all">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="h-4.5 w-4.5" />
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

          {/* Campo Senha */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Senha de Acesso
            </label>
            <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-brand-teal focus-within:bg-white transition-all">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 text-sm text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Botão Entrar */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-teal hover:bg-brand-teal-dark px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-teal/20 active:scale-[0.98] transition-all focus:outline-none disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Verificando Acesso...
                </>
              ) : (
                <>
                  Acessar Painel
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Links de Navegação */}
        <div className="flex items-center justify-between text-xs pt-1">
          <Link
            href="/admin/cadastro"
            className="text-slate-500 font-semibold hover:text-brand-teal transition-colors"
          >
            Solicitar novo acesso
          </Link>
          <Link
            href="/admin/esqueci-senha"
            className="text-slate-500 font-semibold hover:text-brand-teal transition-colors"
          >
            Esqueci minha senha
          </Link>
        </div>

        {/* Informação Resiliente de Mock local */}
        {(!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              🔧 Supabase não configurado localmente. <br />
              Use <strong>admin@mensageiros.org</strong> / <strong>admin123</strong> (Ativo) ou <strong>pendente@mensageiros.org</strong> (Pendente).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
