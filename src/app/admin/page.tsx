import React from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  FileText, 
  Layers, 
  Users, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { courseEvents, newsPosts, transparencyDocs, teamMembers } from '@/lib/mock-data';

export const metadata = {
  title: 'Dashboard Geral | Painel Mensageiros da Esperança',
  description: 'Visão geral administrativa e atalhos rápidos de gerenciamento.',
};

export default function AdminDashboardPage() {
  // Métricas rápidas baseadas nos dados do mock
  const totalCursos = courseEvents.length;
  const totalNoticias = newsPosts.length;
  const totalDocumentos = transparencyDocs.length;
  const totalEquipe = teamMembers.length;

  const cardMetricas = [
    { label: 'Cursos & Oficinas', val: totalCursos, desc: 'Ativos na agenda pública', path: '/admin/agenda', icon: Calendar, color: 'text-primary bg-primary-light' },
    { label: 'Notícias Publicadas', val: totalNoticias, desc: 'Publicações no blog social', path: '/admin/noticias', icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { label: 'Transparência Legal', val: totalDocumentos, desc: 'Arquivos de prestação de contas', path: '/admin/transparencia', icon: Layers, color: 'text-purple-600 bg-purple-50' },
    { label: 'Equipe de Governança', val: totalEquipe, desc: 'Lideranças e coordenações', path: '/admin/equipe', icon: Users, color: 'text-orange-600 bg-orange-50' },
  ];

  return (
    <div className="space-y-10">
      {/* Bloco de Boas-vindas */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-36 h-36 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-light text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-secondary" /> Ambiente Seguro
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Olá, Administrador(a)
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
            Bem-vindo(a) ao painel de controle da OSC **Mensageiros da Esperança**. Aqui você pode gerenciar a agenda de oficinas gratuitas, publicar notícias de impacto social, prestar contas de transparência e visualizar contatos comunitários.
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

      {/* Grid de Métricas do Sistema */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-800 text-base">Visão Geral do Painel</h3>
        
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
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${metric.color}`}>
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

      {/* Linha com Cards de Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Lema Institucional */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-black tracking-widest text-primary uppercase bg-primary-light px-3 py-1.5 rounded-full">
              Lema de Trabalho
            </span>
            <h4 className="text-lg font-extrabold text-slate-800 leading-snug">
              Você não faz parte do problema, mas pode fazer parte da solução!
            </h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Lembre-se de que cada ação executada neste painel reflete diretamente na transparência de dados públicos consumidos por doadores e voluntários e na facilidade de matrícula dos nossos alunos.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
            >
              Ir para o Site Público <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Informações de Suporte Técnico */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
          <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
            Suporte e Auditoria
          </span>
          <h4 className="text-lg font-extrabold text-slate-800 leading-snug">
            Gestão Compartilhada ESG
          </h4>
          <p className="text-slate-500 text-sm leading-relaxed">
            Se precisar realizar cadastros em massa de novos alunos, configurar integrações de banco de dados nativas ou auditar acessos, contate o setor de TI e Compliance do <strong>Instituto Inovação Sustentável</strong>.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-3.5 py-1.5 rounded-full text-xs font-bold">
              Contato TI: suporte@instituto-inovacao.org
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
