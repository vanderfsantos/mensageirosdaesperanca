'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { 
  Lock, 
  Mail, 
  Loader2, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

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
        } else {
          setErrorMessage('E-mail ou senha administrativa incorretos (Modo Simulação).');
          setIsLoading(false);
        }
      }, 1000);
      return;
    }

    // Login Real no Supabase Auth
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message || 'Falha ao autenticar.');
        setIsLoading(false);
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      console.error('Login: Erro inesperado ao autenticar', err);
      setErrorMessage('Ocorreu um erro inesperado ao conectar ao servidor.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-bg px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md">
        
        {/* Identidade Visual */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-secondary animate-pulse" /> Painel de Controle
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Mensageiros da Esperança
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Área restrita à administração e coordenação da OSC.
          </p>
        </div>

        {/* Mensagem de Erro */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 items-start animate-fade-in">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-800 font-bold leading-relaxed">
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
            <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="h-4.5 w-4.5" />
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

          {/* Campo Senha */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Senha de Acesso
            </label>
            <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-4 text-sm text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Botão Entrar */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-md shadow-primary/10 hover:bg-primary-hover active:scale-[0.98] transition-all focus:outline-none disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Verificando...
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
        <div className="flex items-center justify-between text-xs">
          <Link
            href="/admin/cadastro"
            className="text-slate-500 font-semibold hover:text-primary transition-colors"
          >
            Criar nova conta
          </Link>
          <Link
            href="/admin/esqueci-senha"
            className="text-slate-500 font-semibold hover:text-primary transition-colors"
          >
            Esqueci minha senha
          </Link>
        </div>

        {/* Informação Resiliente de Mock local */}
        {(!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              🔧 Supabase não configurado localmente. <br />
              Use <strong>admin@mensageiros.org</strong> / <strong>admin123</strong> (Modo Simulação).
            </p>
          </div>
        )}


      </div>
    </div>
  );
}
