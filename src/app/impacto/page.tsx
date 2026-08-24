import React from 'react';
import Link from 'next/link';
import { 
  Award, 
  Users, 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  LineChart, 
  ArrowRight
} from 'lucide-react';
import { impactStories } from '@/lib/mock-data';

export const metadata = {
  title: 'Nosso Impacto | Mensageiros da Esperança',
  description: 'Explore o dashboard de indicadores de 2025, nossa metodologia de mensuração social e histórias reais de transformação social.',
};

export default function ImpactoPage() {
  const stats = [
    { label: 'Alunos Certificados', value: '1.111', desc: 'Jovens e adultos qualificados em oficinas livres profissionalizantes.', Icon: Award },
    { label: 'Atendimentos Sociais', value: '12.550', desc: 'Sessões de acolhimento psicossocial e triagem assistencial realizadas.', Icon: Users },
    { label: 'Turmas Concluídas', value: '132', desc: 'Turmas de panificação, costura, informática e mídias executadas.', Icon: BookOpen },
    { label: 'Horas de Atividades', value: '4.936h', desc: 'Volume de carga horária pedagógica e comunitária ministrada.', Icon: Clock },
  ];

  const passosMetodologia = [
    {
      title: '1. Diagnóstico Socioassistencial',
      description: 'Ao ingressar em nossos polos ou cursos, cada aluno e sua família passam por um mapeamento socioeconômico conduzido por nossa assistente social, estabelecendo a linha de base do perfil de vulnerabilidade.',
    },
    {
      title: '2. Monitoramento de Frequência e Engajamento',
      description: 'Avaliamos a assiduidade e o progresso pedagógico individual. Casos de evasão ou faltas reiteradas disparam acolhimento psicossocial imediato para compreender e mitigar as causas familiares de abandono.',
    },
    {
      title: '3. Avaliação de Impacto e Empregabilidade (Egressos)',
      description: 'Após a formatura, nossa equipe realiza pesquisas ativas de acompanhamento a cada 3, 6 e 12 meses. Mensuramos a taxa de inserção no mercado de trabalho e o aumento médio da renda familiar decorrente da capacitação.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      {/* Banner Principal */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight">Nosso Impacto</h1>
          <p className="text-primary-light mt-2 text-lg font-light max-w-xl">
            Transparência absoluta e dados reais auditados sobre a transformação gerada em nossas comunidades.
          </p>
        </div>
      </section>

      {/* Dashboard de Indicadores Consolidados */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-sm font-extrabold text-secondary uppercase tracking-widest">
            Dashboard 2025
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Métricas de Transformação Social
          </h2>
          <div className="h-1.5 w-16 bg-secondary mx-auto rounded-full" />
          <p className="text-slate-600">
            Confira as informações auditadas referentes ao encerramento do exercício de 2025.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const StatIcon = stat.Icon;
            return (
              <div 
                key={idx}
                className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-56"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
                    {stat.value}
                  </span>
                  <div className="h-10 w-10 bg-primary-light text-primary rounded-xl flex items-center justify-center">
                    <StatIcon className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm">
                    {stat.label}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {stat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Metodologia de Mensuração Social */}
      <section className="py-20 bg-white border-t border-b border-slate-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Texto Descritivo */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-black tracking-widest text-primary uppercase bg-primary-light px-3 py-1.5 rounded-full">
                Metodologia Científica
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Como medimos nosso impacto?
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Para nós, a prestação de contas vai além da lisura contábil. Nossos indicadores sociais são validados e estruturados trimestralmente sob auditoria metodológica do <strong>Instituto Inovação Sustentável</strong>.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Utilizamos ferramentas de monitoramento adaptadas do terceiro setor internacional para garantir que cada hora de oficina resulte em emancipação econômica ou amparo emocional efetivo.
              </p>
              
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary-light px-3 py-1.5 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5" /> Metodologia Auditada e Transparente
                </span>
              </div>
            </div>

            {/* Passos da Mensuração */}
            <div className="lg:col-span-7 bg-neutral-bg p-8 rounded-3xl border border-slate-200/80 space-y-6 shadow-inner">
              <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2 mb-2">
                <LineChart className="h-5.5 w-5.5 text-secondary" /> Ciclo de Avaliação de Impacto
              </h3>

              <div className="space-y-6">
                {passosMetodologia.map((passo, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="font-bold text-slate-800 text-base">
                      {passo.title}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {passo.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Vitrine de Histórias de Transformação e Chamada */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mb-16 gap-6 text-center sm:text-left">
            <div className="space-y-3">
              <span className="text-sm font-extrabold text-secondary uppercase tracking-widest">
                Relatos de Vidas
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Histórias de Transformação
              </h2>
              <div className="h-1 w-16 bg-secondary mx-auto sm:mx-0 rounded-full" />
            </div>
            <Link 
              href="/historias" 
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-hover group"
            >
              Ver Todas as Histórias <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactStories.slice(0, 3).map((story) => (
              <div 
                key={story.id}
                className="bg-neutral-bg p-8 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between relative"
              >
                <div className="absolute -top-4 left-8 text-6xl text-secondary/15 font-serif leading-none select-none">
                  “
                </div>
                
                <div className="space-y-4">
                  <p className="text-slate-600 text-sm italic relative z-10 leading-relaxed">
                    {story.story}
                  </p>
                  <p className="text-slate-800 font-bold text-sm border-l-2 border-primary pl-3 py-1 bg-primary-light/30">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-200/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.imageUrl}
                    alt={story.name}
                    className="h-12 w-12 rounded-full object-cover shadow-inner bg-slate-100 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{story.name}</h4>
                    <p className="text-xs text-slate-500 capitalize">
                      {story.role === 'participante' ? `Aluno: ${story.project}` : story.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
