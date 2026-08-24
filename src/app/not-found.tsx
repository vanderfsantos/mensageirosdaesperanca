import React from 'react';
import Link from 'next/link';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Página Não Encontrada | Mensageiros da Esperança',
  description: 'Parece que esta página não existe, mas a esperança nunca se perde. Volte para a página inicial.',
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[70vh] items-center justify-center bg-neutral-bg px-4 py-20 text-center">
      <div className="max-w-md space-y-6">
        
        {/* Ícone Animado/Badges */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="h-20 w-20 bg-white rounded-3xl border border-slate-200/60 shadow-md flex items-center justify-center text-primary relative">
            <Sparkles className="h-10 w-10 text-secondary" />
          </div>
        </div>

        {/* Título de Erro */}
        <div className="space-y-2">
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Erro 404</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Página Não Encontrada
          </h2>
        </div>

        {/* Mensagem Acolhedora Institucional */}
        <div className="p-5 bg-white border border-slate-250/50 rounded-2xl shadow-sm">
          <p className="text-slate-600 text-sm leading-relaxed italic">
            &ldquo;Parece que esta página não existe, mas a esperança nunca se perde.&rdquo;
          </p>
        </div>

        {/* Botão de Ação */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/10 hover:bg-primary-hover active:scale-[0.98] transition-all focus:outline-none"
          >
            <Home className="h-4.5 w-4.5" />
            Voltar para a Home
          </Link>
          <Link
            href="/agenda"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all focus:outline-none"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            Ver Agenda de Cursos
          </Link>
        </div>

      </div>
    </div>
  );
}
