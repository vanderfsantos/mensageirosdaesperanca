import React from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Home,
  Lock,
} from 'lucide-react';
import Logo from '@/components/ui/Logo';

export const metadata = {
  title: 'E-mail Confirmado | Mensageiros da Esperança',
  description: 'Confirmação de e-mail e status de aprovação de cadastro institucional.',
};

export default function AguardandoAprovacaoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-bg px-4 py-12">
      <div className="w-full max-w-md space-y-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md animate-scale-up">

        {/* Identidade Visual */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="inline-block focus:outline-none" title="Voltar ao site">
            <Logo variant="default" priority />
          </Link>
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> E-mail Verificado
          </div>
        </div>

        {/* Card Informativo */}
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 shadow-inner">
            <Clock className="h-8 w-8 animate-pulse" />
          </div>

          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            E-mail Confirmado com Sucesso!
          </h1>

          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            Seu cadastro foi registrado no sistema. Por motivos de segurança, o acesso ao painel administrativo requer a liberação de um coordenador da <strong>Mensageiros da Esperança</strong>.
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-primary" /> Próximos Passos
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assim que sua conta for aprovada, você poderá acessar utilizando seu e-mail e a senha cadastrada.
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-3 pt-2">
          <Link
            href="/admin/login"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <Lock className="h-4 w-4" />
            Ir para o Login
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Home className="h-3.5 w-3.5 text-slate-400" />
            Voltar ao site institucional
          </Link>
        </div>

      </div>
    </div>
  );
}
