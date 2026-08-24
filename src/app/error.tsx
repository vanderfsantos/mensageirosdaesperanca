'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Registra o erro no console de forma detalhada
    console.error('Next.js Global Error Intercepted:', error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-[70vh] items-center justify-center bg-neutral-bg px-4 py-20 text-center">
      <div className="max-w-md space-y-6">
        
        {/* Ícone de Alerta */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse" />
          <div className="h-20 w-20 bg-white rounded-3xl border border-slate-200/60 shadow-md flex items-center justify-center text-rose-500 relative">
            <AlertTriangle className="h-10 w-10 text-rose-500" />
          </div>
        </div>

        {/* Título de Erro */}
        <div className="space-y-2">
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Erro de Renderização</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Ops! Algo deu errado.
          </h2>
        </div>

        {/* Mensagem Amigável Institucional */}
        <div className="p-5 bg-white border border-slate-250/50 rounded-2xl shadow-sm space-y-2">
          <p className="text-slate-600 text-sm leading-relaxed">
            Ops! Ocorreu um erro técnico inesperado. Nossa equipe de TI já foi acionada.
          </p>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Digest ID: {error.digest || 'N/A'}
          </p>
        </div>

        {/* Botão de Ação */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            type="button"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/10 hover:bg-primary-hover active:scale-[0.98] transition-all focus:outline-none"
          >
            <RotateCcw className="h-4.5 w-4.5" />
            Tente Novamente
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all focus:outline-none"
          >
            <Home className="h-4.5 w-4.5" />
            Voltar para a Home
          </Link>
        </div>

      </div>
    </div>
  );
}
