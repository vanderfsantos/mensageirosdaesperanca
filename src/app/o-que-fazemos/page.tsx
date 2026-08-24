import React from 'react';
import Image from 'next/image';
import { 
  TrendingUp, 
  Brain, 
  Lightbulb, 
  Wrench, 
  Heart, 
  ShieldAlert, 
  Compass,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'O Que Fazemos | Mensageiros da Esperança',
  description: 'Descubra a metodologia pedagógica, os 4 pilares e os projetos de capacitação e proteção social desenvolvidos pela OSC Mensageiros da Esperança.',
};

export default function OQueFazemos() {
  const pilares = [
    {
      title: 'Empreendedorismo',
      description: 'Capacitamos pessoas para o planejamento comercial, controle financeiro básico e formalização de micro-negócios, promovendo a autonomia de renda.',
      Icon: TrendingUp,
    },
    {
      title: 'Inclusão Produtiva',
      description: 'Oferecemos formação técnica célere e alinhada com as demandas locais do mercado (Cozinha Industrial, TI, Audiovisual) para inserção real de alunos.',
      Icon: Wrench,
    },
    {
      title: 'Educação Emocional',
      description: 'Integramos suporte psicossocial contínuo e rodas de partilha às oficinas, fortalecendo a resiliência e as relações familiares de forma integrada.',
      Icon: Brain,
    },
    {
      title: 'Inovação',
      description: 'Aplicamos novas metodologias digitais e soluções criativas para solucionar problemas crônicos da comunidade, fomentando a cidadania ativa.',
      Icon: Lightbulb,
    },
  ];

  const capacitacoes = [
    {
      title: 'Educação e Inclusão Produtiva',
      target: 'Jovens e Adultos em Transição de Carreira',
      imageUrl: '/images/content/oficina-gastronomia-pratica.jpg',
      description: 'Cursos livres de culinária profissional, panificação, introdução à lógica digital e informática para escritórios, capacitando para rápida colocação profissional.',
      details: ['Panificação e Gastronomia Prática', 'Informática e Inclusão Digital', 'Orientação para o Mercado'],
    },
    {
      title: 'Empreendedorismo e Mulheres',
      target: 'Mulheres e Mães Solo',
      imageUrl: '/images/content/oficina-artesanato.jpg',
      description: 'Oficinas de artesanato, economia criativa e confeitaria com foco em emancipação feminina, gestão de pequenos negócios e redes de apoio comunitário.',
      details: ['Artesanato e Costura Criativa', 'Precificação e Vendas', 'Autocuidado e Emancipação'],
    },
    {
      title: 'Saúde, Cultura e Esporte',
      target: 'Crianças, Jovens e 50+',
      imageUrl: '/images/content/jogos-osasco.jpg',
      description: 'Atividades esportivas coletivas, jogos integrativos, oficinas de expressão artística e rodas comunitárias para promoção da saúde preventiva e qualidade de vida.',
      details: ['Jogos Integrativos e Esportes', 'Rodas de Convivência Ativa', 'Apoio Psicossocial Contínuo'],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight">O Que Fazemos</h1>
          <p className="text-primary-light mt-2 text-lg font-light max-w-xl">
            A educação profissional e o cuidado social como chaves para a emancipação e cidadania.
          </p>
        </div>
      </section>

      {/* Metodologia Pedagógica baseada na LDB */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Texto Descritivo */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-black tracking-widest text-primary uppercase bg-primary-light px-3 py-1.5 rounded-full">
                Metodologia Ativa
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                O Trabalho como Princípio Educativo (LDB)
              </h2>
              <div className="h-1.5 w-16 bg-secondary rounded-full" />
              
              <div className="space-y-4 text-slate-600 leading-relaxed text-base">
                <p>
                  Nossa matriz de ensino e atuação fundamenta-se nos princípios da <strong>Lei de Diretrizes e Bases da Educação Nacional (LDB)</strong>, compreendendo que a educação se vincula estreitamente ao mundo do trabalho e às práticas sociais.
                </p>
                <p>
                  Defendemos a tese pedagógica do <strong>trabalho como princípio educativo</strong>: o fazer técnico e manual não é um fim em si mesmo, mas um organizador cognitivo e social. Através das oficinas de panificação, TI e audiovisual, nossos alunos não apenas aprendem uma profissão, mas debatem sobre cooperação, ética cidadã, inovação comunitária e dignidade social.
                </p>
              </div>
            </div>

            {/* Destaque Visual Metodológico Real */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-primary-light rounded-3xl -rotate-2 scale-98 pointer-events-none" />
              <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-md h-80 group">
                <Image
                  src="/images/content/oficina-gastronomia-pratica.jpg"
                  alt="Oficina prática de capacitação profissional na Cozinha-Escola"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-4 text-white">
                  <p className="text-xs font-semibold">Aprendizagem prática e inclusão produtiva</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Os 4 Pilares da Atuação */}
      <section className="py-20 bg-neutral-bg border-t border-b border-slate-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-extrabold text-secondary uppercase tracking-widest">
              Sustentação Pedagógica
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Nossos 4 Pilares Fundamentais
            </h2>
            <div className="h-1.5 w-16 bg-secondary mx-auto rounded-full" />
            <p className="text-slate-600">
              Guiamos o planejamento de todas as oficinas livres e assistências sob uma abordagem sistêmica de desenvolvimento humano.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pilares.map((pilar) => {
              const PilarIcon = pilar.Icon;
              return (
                <div 
                  key={pilar.title}
                  className="group bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <PilarIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">
                      {pilar.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {pilar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detalhamento dos Eixos de Capacitação com Fotos Reais */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-extrabold text-primary uppercase tracking-widest">
              Público-Alvo e Cursos
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Eixos de Capacitação e Oficinas
            </h2>
            <div className="h-1.5 w-16 bg-primary mx-auto rounded-full" />
            <p className="text-slate-600">
              Estruturamos programas focados nas principais carências e potencialidades de desenvolvimento na comunidade.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {capacitacoes.map((cap) => (
              <div 
                key={cap.title}
                className="group bg-neutral-bg rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  {/* Foto Real do Eixo */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={cap.imageUrl}
                      alt={cap.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-bold text-secondary uppercase bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded shadow-sm">
                        {cap.target}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4">
                    <h3 className="text-xl font-extrabold text-slate-800 tracking-tight group-hover:text-primary transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0">
                  <div className="pt-6 border-t border-slate-200/60">
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
                      Principais Componentes:
                    </h4>
                    <ul className="space-y-2">
                      {cap.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                          <span className="h-1.5 w-1.5 bg-primary rounded-full shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ações de Proteção Social e Assistencial */}
      <section className="py-24 bg-secondary-light/25 border-t border-b border-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Box Detalhado das Frentes de Cuidado */}
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              <span className="text-xs font-black tracking-widest text-secondary uppercase bg-secondary-light px-3 py-1.5 rounded-full">
                Proteção Social
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Cuidado e Assistência Social Integrada
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                Nossa atuação não é puramente educacional. Compreendemos que famílias em extrema carência física e psicológica necessitam de acolhimento e proteção de forma imediata antes e durante os processos de capacitação.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-secondary">
                    <ShieldAlert className="h-5 w-5 shrink-0" />
                    <h4 className="font-extrabold text-slate-800 text-sm">Triagem Social</h4>
                  </div>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Nossa equipe de assistentes sociais faz o cadastramento e acompanhamento contínuo da vulnerabilidade socioeconômica local.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-secondary">
                    <Heart className="h-5 w-5 shrink-0" />
                    <h4 className="font-extrabold text-slate-800 text-sm">Acolhimento Individual</h4>
                  </div>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Atendimento psicológico individual e coletivo para reestruturação emocional e superação de traumas familiares e sociais.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-secondary">
                    <Compass className="h-5 w-5 shrink-0" />
                    <h4 className="font-extrabold text-slate-800 text-sm">Bazar & Alimentação</h4>
                  </div>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Distribuição programada de mantimentos de qualidade e bazar de roupas gratuito para todas as famílias cadastradas.
                  </p>
                </div>
              </div>
            </div>

            {/* Chamada para Apoiar */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6 order-1 lg:order-2">
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">
                Como manter essas ações ativas?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Cada oficina, computador disponível na sala de informática, forno aceso da panificação ou atendimento social de acolhimento emergencial é viabilizado por meio de doações. Colabore e mude realidades conosco.
              </p>
              <div className="pt-2">
                <Link
                  href="/faca-parte"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-4 text-base font-bold text-white shadow-md shadow-secondary/15 hover:bg-secondary-hover hover:scale-102 transition-all focus:outline-none"
                >
                  FAÇA UMA DOAÇÃO AGORA
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
