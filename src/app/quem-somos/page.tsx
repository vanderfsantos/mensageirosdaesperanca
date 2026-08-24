import React from 'react';
import { Heart, Eye, Award, Shield, Users } from 'lucide-react';
import Timeline from '@/components/ui/Timeline';
import UnidadeCard from '@/components/ui/UnidadeCard';
import OdsCard from '@/components/ui/OdsCard';
import { getTeamMembers } from '@/lib/supabaseClient';

export const metadata = {
  title: 'Quem Somos | Mensageiros da Esperança',
  description: 'Conheça a história, governança, unidades de atendimento e os Objetivos de Desenvolvimento Sustentável da OSC Mensageiros da Esperança.',
};

export default async function QuemSomos() {
  const teamData = await getTeamMembers();
  const team = [...teamData].sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));

  const units = [
    {
      name: 'Sede Lapa',
      address: 'Rua da Solidariedade, 450 - Jd. Esperança, São Paulo - SP',
      services: ['Cursos de Panificação e Confeitaria', 'Acolhimento Familiar', 'Distribuição de Cestas Básicas'],
      mapUrl: 'https://maps.google.com/?q=Rua+da+Solidariedade,+450+Lapa+Sao+Paulo',
      description: 'Nosso centro administrativo e pioneiro, onde iniciamos as primeiras oficinas de panificação social.',
    },
    {
      name: 'Praça da Cidadania Osasco',
      address: 'Av. dos Autonomistas, 1500 - Vila Yara, Osasco - SP',
      services: ['Oficinas de TI e Inclusão Digital', 'Programação Básica', 'Atendimento Psicossocial'],
      mapUrl: 'https://maps.google.com/?q=Av.+dos+Autonomistas,+1500+Osasco',
      description: 'Polo voltado à tecnologia e inovação, qualificando jovens e adultos para o mercado de trabalho digital.',
    },
    {
      name: 'Casinha Azul Vila Yolanda',
      address: 'Rua das Flores, 98 - Vila Yolanda, Osasco - SP',
      services: ['Apoio Escolar e Letramento', 'Oficinas Lúdicas e de Leitura', 'Brinquedoteca Comunitária'],
      mapUrl: 'https://maps.google.com/?q=Rua+da+Solidariedade,+450+Lapa+Sao+Paulo',
      description: 'Espaço acolhedor no contraturno escolar focado no desenvolvimento integral de crianças de 6 a 12 anos.',
    },
    {
      name: 'Núcleo Zen Raiz',
      address: 'Estrada dos Romeiros, Km 42 - Santana de Parnaíba - SP',
      services: ['Terapias Integrativas', 'Horta Comunitária e Fitoterapia', 'Apoio Psicológico Coletivo'],
      mapUrl: 'https://maps.google.com/?q=Estrada+dos+Romeiros+Km+42+Santana+de+Parnaiba',
      description: 'Espaço ecológico voltado ao bem-estar integral, reconexão com a terra e cuidado com a saúde mental.',
    },
    {
      name: 'Mensageiros Cast',
      address: 'Rua Lapa, 12 - Lapa, São Paulo - SP',
      services: ['Gravação de Podcasts', 'Produção Audiovisual', 'Oficinas de Produção de Mídia'],
      mapUrl: 'https://maps.google.com/?q=Rua+Lapa,+12+Lapa+Sao+Paulo',
      description: 'Negócio social e estúdio profissional para locação, ensinando jovens sobre rádio, som e edição de vídeo.',
    },
    {
      name: 'Cozinha-Escola Doce Mensageiro',
      address: 'Rua da Lapa, 452 - Lapa, São Paulo - SP',
      services: ['Cursos de Panificação Comercial', 'Confeitaria e Doceria', 'Produção do Buffet Social'],
      mapUrl: 'https://maps.google.com/?q=Rua+da+Lapa,+452+Lapa+Sao+Paulo',
      description: 'Cozinha industrial equipada, responsável pela produção de itens do Buffet Social e formação profissionalizante.',
    },
  ];

  const odsList = [
    {
      number: 1,
      title: 'Erradicação da Pobreza',
      description: 'Combate direto à extrema pobreza fornecendo insumos alimentares, apoio técnico e caminhos profissionais para a autonomia financeira de famílias cadastradas.',
    },
    {
      number: 3,
      title: 'Saúde e Bem-Estar',
      description: 'Atendimento e orientação psicossocial contínuo para indivíduos, casais e famílias, promovendo a integridade psicológica e física.',
    },
    {
      number: 4,
      title: 'Educação de Qualidade',
      description: 'Oferta de reforço escolar no contraturno, letramento infantil e oficinas técnicas de livre acesso com altos padrões didáticos.',
    },
    {
      number: 5,
      title: 'Igualdade de Gênero',
      description: 'Empoderamento de mulheres e mães solo através de oficinas profissionalizantes de confeitaria, geração de renda e ciclos de debate comunitários.',
    },
    {
      number: 8,
      title: 'Trabalho Decente e Crescimento Econômico',
      description: 'Qualificação técnica em áreas de demanda atual (TI, Panificação, Audiovisual) e inserção produtiva no mercado de trabalho.',
    },
    {
      number: 10,
      title: 'Redução das Desigualdades',
      description: 'Promoção da cidadania integral e defesa de direitos básicos para comunidades periféricas e minorias sociais.',
    },
    {
      number: 16,
      title: 'Paz, Justiça e Instituições Eficazes',
      description: 'Desenvolvimento de uma governança ética com prestação de contas integral sob assessoria administrativa qualificada.',
    },
    {
      number: 17,
      title: 'Parcerias e Meios de Implementação',
      description: 'Mobilização conjunta com o Instituto Inovação Sustentável, prefeituras locais e empresas para viabilização de metas comuns.',
    },
    {
      number: 18,
      title: 'Igualdade Racial (Meta Brasil)',
      description: 'Promoção da equidade étnico-racial em todas as nossas instâncias de contratação, acolhimento e seleção de alunos, defendendo os direitos de negros e indígenas.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight">Quem Somos</h1>
          <p className="text-primary-light mt-2 text-lg font-light max-w-xl">
            Conheça nossa trajetória, equipe de governança e compromisso socioambiental.
          </p>
        </div>
      </section>

      {/* Apresentação Institucional e Relação Jurídica */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Espaço Acolhedor de Inclusão e Transformação
              </h2>
              <div className="h-1.5 w-16 bg-secondary rounded-full" />
              
              <div className="space-y-4 text-slate-600 leading-relaxed text-base">
                <p>
                  A <strong>Mensageiros da Esperança</strong> é uma Organização da Sociedade Civil (OSC) sem fins lucrativos que atua no acolhimento de famílias e no desenvolvimento social comunitário. Nossos programas focam em dar suporte integral a mulheres em situação de vulnerabilidade, jovens em busca de qualificação profissional, pessoas com mais de 50 anos que necessitam de reinserção produtiva e famílias que buscam caminhos dignos de desenvolvimento.
                </p>
                <p>
                  Acreditamos na educação aliada ao cuidado psicológico e na inclusão produtiva digital e gastronômica como os pilares essenciais para que cada indivíduo retome as rédeas de seu próprio futuro e exerça plenamente sua cidadania.
                </p>
              </div>
            </div>

            {/* Caixa de Relação Jurídica */}
            <div className="lg:col-span-5 bg-secondary-light/45 border border-secondary/20 rounded-3xl p-8 space-y-4">
              <div className="flex items-center gap-3 text-secondary">
                <Shield className="h-7 w-7 shrink-0" />
                <h3 className="text-lg font-extrabold tracking-tight">
                  Governança & Parceria Institucional
                </h3>
              </div>
              <div className="h-0.5 w-full bg-secondary/10" />
              <p className="text-slate-700 text-sm leading-relaxed">
                A gestão administrativa, orçamentária e de captação de recursos da OSC Mensageiros da Esperança é realizada sob cooperação e assessoria técnica do <strong>Instituto Inovação Sustentável</strong>. 
              </p>
              <p className="text-slate-700 text-sm leading-relaxed">
                Essa relação garante auditoria contábil completa, cumprimento pleno da legislação nacional do Terceiro Setor (MROSC) e adequação dos nossos projetos a padrões corporativos globais de impacto social e conformidade ESG.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-20 bg-neutral-bg border-t border-b border-slate-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card Missão */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Missão</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Acolher e empoderar indivíduos e famílias sob risco social através de educação profissionalizante, inclusão digital, oficinas socioeducativas e suporte psicossocial humanizado.
              </p>
            </div>

            {/* Card Visão */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-light text-secondary">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Visão</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Consolidar-se como um polo de transformação e emancipação comunitária de referência nacional, mantendo sustentabilidade orçamentária e governança baseada em critérios ESG.
              </p>
            </div>

            {/* Card Valores */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Valores</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Solidariedade ativa, transparência administrativa total, diversidade étnico-racial com equidade social, inovação educacional e profundo respeito à dignidade de cada cidadão.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Linha do Tempo */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-extrabold text-primary uppercase tracking-widest">
              Linha do Tempo
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Nossa Trajetória
            </h2>
            <div className="h-1.5 w-16 bg-primary mx-auto rounded-full" />
            <p className="text-slate-600">
              Clique nos anos marcantes para explorar a evolução e conquistas históricas ao longo de 28 anos de dedicação.
            </p>
          </div>
          
          <Timeline />
        </div>
      </section>

      {/* Governança e Equipe */}
      <section id="equipe" className="py-24 bg-neutral-bg border-t border-b border-slate-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-extrabold text-secondary uppercase tracking-widest">
              Liderança e Responsabilidade
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Governança e Equipe Técnica
            </h2>
            <div className="h-1.5 w-16 bg-secondary mx-auto rounded-full" />
            <p className="text-slate-600">
              Nossos diretores e conselheiros atuam de forma transparente, liderando a execução de projetos e auditorias orçamentárias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div 
                key={member.id || member.name}
                className="group bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Badge de Mandato */}
                <div className="absolute top-4 right-4 bg-primary-light text-primary text-[10px] font-bold px-2 py-1 rounded">
                  {member.mandate || 'Gestão 2024-2026'}
                </div>

                <div className="space-y-4">
                  {/* Foto de Perfil */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Users className="h-7 w-7" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-800 text-base leading-snug group-hover:text-primary transition-colors">
                      {member.name}
                    </h4>
                    <p className="text-xs text-secondary font-bold uppercase tracking-wider">
                      {member.role}
                    </p>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossas Unidades */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-extrabold text-primary uppercase tracking-widest">
              Onde Atuamos
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Nossas Unidades de Atendimento
            </h2>
            <div className="h-1.5 w-16 bg-primary mx-auto rounded-full" />
            <p className="text-slate-600">
              Contamos com sedes administrativas, polos de capacitação técnica, núcleos ambientais e negócios sociais na grande São Paulo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {units.map((unit) => (
              <UnidadeCard
                key={unit.name}
                name={unit.name}
                address={unit.address}
                services={unit.services}
                mapUrl={unit.mapUrl}
                description={unit.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ODS Norteadoras */}
      <section className="py-24 bg-neutral-bg border-t border-slate-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-sm font-extrabold text-secondary uppercase tracking-widest">
              Impacto Sustentável
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Objetivos de Desenvolvimento Sustentável (ODS)
            </h2>
            <div className="h-1.5 w-16 bg-secondary mx-auto rounded-full" />
            <p className="text-slate-600">
              Nossas oficinas e diretrizes operacionais estão alinhadas aos seguintes Objetivos da Agenda 2030 da ONU, incluindo a diretiva nacional ODS 18 de igualdade étnico-racial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {odsList.map((ods) => (
              <OdsCard
                key={ods.number}
                number={ods.number}
                title={ods.title}
                description={ods.description}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
