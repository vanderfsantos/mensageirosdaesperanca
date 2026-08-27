import React from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  FileText, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Plus,
  Heart
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { courseEvents, newsPosts, transparencyDocs, impactStories } from '@/lib/mock-data';

export const metadata = {
  title: 'Dashboard Geral | Painel Mensageiros da Esperança',
  description: 'Visão geral administrativa e atalhos rápidos de gerenciamento.',
};

export default async function AdminDashboardPage() {
  let userName = 'Administrador(a)';

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.full_name?.trim()) {
          userName = profile.full_name.trim();
        } else if (user.user_metadata?.full_name?.trim()) {
          userName = user.user_metadata.full_name.trim();
        } else if (user.email) {
          userName = user.email.split('@')[0];
        }
      }
    } catch {
      // Fallback gracioso
    }
  }

  // Métricas dinâmicas do sistema
  const totalCursos = courseEvents.length;
  const totalNoticias = newsPosts.length;
  const totalDocumentos = transparencyDocs.length;
  const totalHistorias = impactStories.length;
  const mensagensNaoLidas = 5; // Simulação de mensagens pendentes do formulário de contato

  const cardMetricas = [
    { label: 'Cursos & Oficinas', val: totalCursos, desc: 'Ativos na agenda pública', path: '/admin/agenda', icon: Calendar, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { label: 'Notícias Publicadas', val: totalNoticias, desc: 'Artigos no portal social', path: '/admin/noticias', icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { label: 'Histórias de Impacto', val: totalHistorias, desc: 'Relatos de transformação', path: '/admin/historias', icon: Heart, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { label: 'Transparência Legal', val: totalDocumentos, desc: 'Relatórios de contas (MROSC)', path: '/admin/transparencia', icon: Layers, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="space-y-10">
      {/* Bloco de Boas-vindas Dinâmico */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-36 h-36 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-light text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-secondary animate-pulse" /> Ambiente Seguro
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Olá, {userName}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
            Bem-vindo(a) ao painel de controle da OSC <strong>Mensageiros da Esperança</strong>. Publique oportunidades, gerencie dados de compliance legal e visualize relatos de impacto comunitário.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between relative z-10">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Gestão Administrativa Integrada
          </span>
          <span className="text-xs text-primary-light font-bold">
            Instituto Inovação Sustentável
          </span>
        </div>
      </div>

      {/* Seção de Ações Rápidas */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-800 text-base">Atalhos e Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Novo Curso */}
          <Link
            href="/admin/agenda/novo"
            className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200/60 rounded-2xl text-slate-700 hover:border-primary hover:text-primary transition-all text-center gap-2 group shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="h-10 w-10 bg-primary-light text-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Plus className="h-5 w-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm">Novo Curso</span>
          </Link>

          {/* Nova Notícia */}
          <Link
            href="/admin/noticias/nova"
            className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200/60 rounded-2xl text-slate-700 hover:border-primary hover:text-primary transition-all text-center gap-2 group shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Plus className="h-5 w-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm">Nova Notícia</span>
          </Link>

          {/* Novo Link Drive */}
          <Link
            href="/admin/transparencia/novo"
            className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200/60 rounded-2xl text-slate-700 hover:border-primary hover:text-primary transition-all text-center gap-2 group shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Plus className="h-5 w-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm">Novo Link Drive</span>
          </Link>

          {/* Nova História */}
          <Link
            href="/admin/historias/nova"
            className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200/60 rounded-2xl text-slate-700 hover:border-primary hover:text-primary transition-all text-center gap-2 group shadow-sm hover:shadow-md cursor-pointer"
          >
            <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Plus className="h-5 w-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm">Nova História</span>
          </Link>
        </div>
      </div>

      {/* Grid de Métricas do Sistema */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-800 text-base font-sans">Visão Geral do Painel</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardMetricas.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div 
                key={index}
                className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-all h-44"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-850 tracking-tight">
                    {metric.val}
                  </span>
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${metric.color} border`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{metric.label}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] sm:text-xs">{metric.desc}</span>
                    <Link 
                      href={metric.path}
                      className="text-primary hover:text-primary-hover text-xs font-black uppercase tracking-wider flex items-center gap-0.5"
                    >
                      Acessar <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Linha Inferior: Central de Contato & Informações Suporte */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Bloco de Mensagens de Contato pendentes */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-50 border border-amber-250 text-amber-800 text-[10px] font-black uppercase tracking-wider">
              Central de Atendimento
            </span>
            <h4 className="text-lg font-extrabold text-slate-800">
              Você tem {mensagensNaoLidas} novas mensagens pendentes
            </h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Existem contatos enviados pelo formulário público do site aguardando atendimento ou roteamento de assunto para a coordenação.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <Link
              href="/admin/mensagens"
              className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:text-primary-hover uppercase tracking-wider"
            >
              Responder Mensagens <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assuntos: Cursos, Voluntariado, ESG</span>
          </div>
        </div>

        {/* Informações de Suporte Técnico */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
              TI e Compliance
            </span>
            <h4 className="text-lg font-extrabold text-slate-800 leading-snug">
              Gestão Corporativa ESG
            </h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              O gerenciamento e relatórios de auditoria de acessos são mantidos sob cooperação técnica do <strong>Instituto Inovação Sustentável</strong>.
            </p>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-3.5 py-1.5 rounded-full text-[10px] font-bold">
              suporte@instituto-inovacao.org
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
