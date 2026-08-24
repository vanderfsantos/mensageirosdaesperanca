import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  TrendingUp, 
  HeartHandshake, 
  Activity, 
  Shield, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Heart, 
  Sparkles, 
  Users
} from 'lucide-react';
import { courseEvents } from '@/lib/mock-data';
import ImpactCounter from '@/components/ui/ImpactCounter';
import EixoCard from '@/components/ui/EixoCard';
import NegocioSocialCard from '@/components/ui/NegocioSocialCard';

export default function Home() {
  // Filtra os 3 primeiros cursos/oficinas próximos da vitrine
  const upcomingCourses = courseEvents.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-teal to-brand-teal-dark text-white py-28 px-4 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-brand-teal-light text-xs font-bold uppercase tracking-wider border border-white/20">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold animate-pulse" /> Desde 1998 Transformando Vidas
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                Educação, oportunidades e cuidado para transformar vidas.
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl font-light leading-relaxed">
                Atuamos no acolhimento e desenvolvimento de mulheres, jovens, pessoas 50+ e famílias em situação de vulnerabilidade, viabilizando novos caminhos através da inclusão produtiva e do suporte emocional.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  href="/agenda"
                  className="inline-flex items-center justify-center rounded-xl bg-brand-orange hover:bg-brand-orange-dark px-8 py-4 text-base font-black uppercase tracking-wider text-white shadow-xl shadow-brand-orange/25 hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none"
                >
                  QUERO PARTICIPAR
                </Link>
                <Link
                  href="/faca-parte#doacoes"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-white bg-white/10 backdrop-blur-sm px-8 py-4 text-base font-bold text-white hover:bg-white hover:text-brand-teal-dark hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none"
                >
                  QUERO APOIAR
                </Link>
                <Link
                  href="/impacto"
                  className="inline-flex items-center justify-center gap-1.5 px-6 py-4 text-base font-bold text-white hover:text-brand-gold transition-colors"
                >
                  CONHEÇA NOSSO IMPACTO <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Elemento Gráfico / Destaque visual */}
            <div className="lg:col-span-5 hidden lg:flex justify-center relative">
              <div className="relative w-80 h-80 rounded-full bg-gradient-to-tr from-brand-orange to-brand-gold p-2 shadow-2xl">
                <div className="w-full h-full rounded-full bg-brand-teal-dark/80 backdrop-blur-md flex flex-col justify-center items-center text-center p-8 border border-white/20">
                  <Heart className="h-16 w-16 text-brand-orange fill-brand-orange/30 mb-4 animate-bounce" />
                  <p className="text-lg font-bold text-white uppercase tracking-wider">Você pode fazer parte da solução!</p>
                  <p className="text-xs text-brand-teal-light mt-2">Colabore com nossos projetos de acolhimento social e inclusão produtiva.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bloco Quem Somos Resumo */}
      <section id="quem-somos" className="py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-brand-teal-light rounded-3xl -rotate-3 scale-98 pointer-events-none" />
              <div className="relative bg-brand-gray-light p-10 rounded-3xl border border-brand-gray-surface shadow-md flex flex-col justify-center items-center text-center h-80">
                <Users className="h-16 w-16 text-brand-teal mb-4" />
                <h3 className="text-xl font-extrabold text-slate-800">Inclusão e Cidadania</h3>
                <p className="text-sm text-slate-500 mt-2">Promovendo dignidade e autonomia social há mais de duas décadas em São Paulo.</p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="text-xs font-black tracking-widest text-brand-teal uppercase bg-brand-teal-light px-3 py-1.5 rounded-full">
                Quem Somos
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Há 28 anos transformando esperança em ação
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                Fundada em 1998, a <strong>Mensageiros da Esperança</strong> nasceu com a missão de reduzir as desigualdades sociais e apoiar o desenvolvimento de grupos vulneráveis. Oferecemos um espaço acolhedor e integrador, onde a educação atua como ferramenta de empoderamento e reinserção social.
              </p>
              <div className="pt-2">
                <Link
                  href="/quem-somos"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-teal/20 hover:bg-brand-teal-dark transition-colors focus:outline-none"
                >
                  Conheça Nossa História
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Grid de Impacto (Contadores) */}
      <section id="impacto" className="py-20 bg-brand-gray-light border-b border-brand-gray-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-extrabold text-brand-orange uppercase tracking-widest">
              Impacto Mensurável
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Resultados de Transformação em 2025
            </h2>
            <div className="h-1 w-16 bg-brand-orange mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ImpactCounter targetValue={1111} label="Alunos Certificados" />
            <ImpactCounter targetValue={12550} label="Atendimentos Prestados" />
            <ImpactCounter targetValue={132} label="Turmas Realizadas" />
            <ImpactCounter targetValue={4936} label="Horas de Atividades" suffix="h" />
          </div>
        </div>
      </section>

      {/* 4. Eixos de Atuação */}
      <section id="eixos" className="py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-extrabold text-brand-teal uppercase tracking-widest">
              Frentes de Trabalho
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Nossos Eixos de Atuação
            </h2>
            <div className="h-1 w-16 bg-brand-teal mx-auto rounded-full" />
            <p className="text-slate-600">
              Desenvolvemos projetos e programas integrados que cobrem as principais necessidades comunitárias e familiares.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <EixoCard 
              title="Educação e Inclusão Produtiva" 
              description="Alfabetização de adultos, reforço escolar infanto-juvenil e cursos livres voltados para a capacitação no mercado de trabalho tradicional." 
              IconComponent={BookOpen} 
            />
            <EixoCard 
              title="Empreendedorismo" 
              description="Apoio e mentoria a pequenos empreendedores comunitários, qualificando para geração de renda autônoma e economia criativa." 
              IconComponent={TrendingUp} 
            />
            <EixoCard 
              title="Cuidado Psicossocial" 
              description="Suporte psicológico contínuo e orientação social para acolher e fortalecer a saúde mental de indivíduos e famílias." 
              IconComponent={HeartHandshake} 
            />
            <EixoCard 
              title="Saúde, Cultura e Esporte" 
              description="Incentivo à convivência saudável e à expressão comunitária por meio de treinos esportivos, oficinas culturais e eventos de lazer ativo." 
              IconComponent={Activity} 
            />
            <EixoCard 
              title="Proteção Social" 
              description="Distribuição planejada de cestas básicas, roupas, apoio jurídico emergencial e defesa integral dos direitos de cidadania." 
              IconComponent={Shield} 
            />
          </div>
        </div>
      </section>

      {/* 5. Vitrine de Oportunidades */}
      <section id="oportunidades" className="py-24 bg-brand-gray-light border-b border-brand-gray-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 gap-6 text-center md:text-left">
            <div className="space-y-3">
              <span className="text-sm font-extrabold text-brand-orange uppercase tracking-widest">
                Vitrine de Oportunidades
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Próximos Cursos e Oficinas
              </h2>
              <div className="h-1 w-16 bg-brand-orange mx-auto md:mx-0 rounded-full" />
            </div>
            <Link 
              href="/agenda" 
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-teal hover:text-brand-teal-dark group"
            >
              Acesse a Agenda Completa <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingCourses.map((event) => (
              <div 
                key={event.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-brand-teal/40"
              >
                <div className="relative h-48 overflow-hidden bg-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-xs font-bold text-brand-teal shadow-sm uppercase tracking-wider">
                      {event.category === 'capacitacao' ? 'Capacitação' : event.category === 'socioeducativo' ? 'Socioeducativo' : 'Evento'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 space-y-4">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-brand-teal shrink-0" />
                      {event.date}
                    </span>
                    {event.time && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-brand-teal shrink-0" />
                        {event.time}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-brand-teal transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed flex-grow">
                    {event.description}
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      {event.spotsLeft ? `${event.spotsLeft} vagas restantes` : 'Entrada Livre'}
                    </span>
                    <Link
                      href={`/agenda/${event.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-brand-teal hover:text-brand-teal-dark transition-all"
                    >
                      Ver Detalhes <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Negócios Sociais em Destaque */}
      <section id="negocios-sociais" className="py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-extrabold text-brand-teal uppercase tracking-widest">
              Sustentabilidade Financeira
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Negócios Sociais em Destaque
            </h2>
            <div className="h-1 w-16 bg-brand-teal mx-auto rounded-full" />
            <p className="text-slate-600">
              Geramos sustentabilidade por meio de iniciativas comerciais e de comunicação que revertem 100% dos lucros para a manutenção das nossas oficinas gratuitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <NegocioSocialCard
              title="Buffet Social Doce Mensageiro"
              tagline="Gastronomia Social"
              description="Contrate serviços de buffet e confeitaria profissional para casamentos, formaturas ou reuniões corporativas. Nossos alimentos são elaborados por alunos qualificados e chefs instrutores da nossa própria cozinha industrial."
              imageUrl="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop"
              ctaLink="/negocios-sociais"
            />
            <NegocioSocialCard
              title="Mensageiros Cast"
              tagline="Estúdio e Podcasting"
              description="Nosso estúdio profissional de gravação audiovisual está aberto para locação comunitária e corporativa. Equipado com microfones e câmeras de alta fidelidade, além de apoiar a formação técnica em som e vídeo de jovens."
              imageUrl="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop"
              ctaLink="/negocios-sociais"
            />
            <NegocioSocialCard
              title="Soluções Corporativas"
              tagline="Consultoria ESG"
              description="Apoiamos empresas parceiras na estruturação de programas de diversidade, mentorias corporativas voluntárias, palestras motivacionais e ações integradas de responsabilidade social com foco em impacto ESG real."
              imageUrl="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop"
              ctaLink="/faca-parte#empresas"
            />
          </div>
        </div>
      </section>

      {/* 7. Chamada Final de Mobilização (Banner CTA Totalmente em brand-orange) */}
      <section id="doe" className="py-24 bg-brand-orange text-white text-center relative px-4">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <span className="inline-flex items-center gap-1.5 text-white font-black tracking-widest text-xs uppercase bg-black/15 px-4 py-2 rounded-full border border-white/20">
            <Heart className="h-4.5 w-4.5 fill-current" /> Participe Dessa Corrente
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-3xl mx-auto text-white">
            &ldquo;Você não faz parte do problema, mas pode fazer parte da solução!&rdquo;
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
            Ajude-nos a manter mais de 15 oficinas gratuitas de qualificação digital e apoio humanitário ativas. Toda contribuição é essencial para ampliar o alcance e apoiar novas famílias.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/faca-parte#doacoes"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-white text-brand-orange-dark px-8 py-4 text-base font-black uppercase tracking-wider shadow-xl shadow-black/10 hover:bg-slate-50 hover:scale-105 transition-all focus:outline-none"
            >
              Doe Agora
            </Link>
            <Link
              href="/faca-parte#empresas"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border-2 border-white bg-transparent px-8 py-4 text-base font-bold text-white hover:bg-white hover:text-brand-orange-dark hover:scale-105 transition-all focus:outline-none"
            >
              Seja Parceiro
            </Link>
            <Link
              href="/faca-parte#voluntario"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border-2 border-white bg-transparent px-8 py-4 text-base font-bold text-white hover:bg-white hover:text-brand-orange-dark hover:scale-105 transition-all focus:outline-none"
            >
              Seja Voluntário
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
