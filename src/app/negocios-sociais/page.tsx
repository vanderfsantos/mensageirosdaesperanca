'use client';

import React, { useState } from 'react';
import { 
  Flame, 
  Wrench, 
  Mic, 
  Briefcase, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';
import { submitContactMessageAction } from '@/app/admin/mensagens/actions';

type ServiceKey = 'buffet' | 'economia-circular' | 'estudio' | 'esg';

interface SocialBusinessInfo {
  title: string;
  tagline: string;
  description: string;
  impactText: string;
  imageUrl: string;
  benefits: string[];
}

export default function NegociosSociaisPage() {
  const [activeTab, setActiveTab] = useState<ServiceKey>('buffet');
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: 'buffet',
    message: '',
  });

  const businesses: Record<ServiceKey, SocialBusinessInfo> = {
    buffet: {
      title: 'Buffet Social Doce Mensageiro',
      tagline: 'Gastronomia Social de Alto Padrão',
      description: 'Oferecemos serviços completos de coffee break, coquetéis, almoços corporativos, aniversários e casamentos. Nossa equipe técnica é composta por chefs qualificados e alunos formados nas oficinas da nossa própria cozinha industrial, assegurando uma experiência gastronômica impecável para o seu evento.',
      impactText: 'Ao contratar o nosso buffet social, 100% do lucro líquido gerado é revertido de forma imediata para subsidiar os cursos profissionalizantes gratuitos de panificação, confeitaria e culinária básica oferecidos à comunidade local.',
      imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
      benefits: [
        'Cardápios customizados e alta confeitaria',
        'Profissionais qualificados da própria comunidade',
        'Impacto social corporativo imediato e metrificado',
        'Ingredientes selecionados e boas práticas de manipulação'
      ],
    },
    'economia-circular': {
      title: 'Economia Circular & Costura Criativa',
      tagline: 'Moda Sustentável e Reciclagem Têxtil',
      description: 'Nosso projeto de economia criativa desenvolve bolsas, necessaires, mochilas e brindes institucionais através do reaproveitamento (upcycling) de resíduos e sobras têxteis cedidas por confecções parceiras. Também gerenciamos um bazar beneficente permanente de roupas e utilidades domésticas.',
      impactText: 'Cada brinde corporativo encomendado ou produto comprado no bazar financia as oficinas de costura criativa e modelagem para mães e mulheres em situação de vulnerabilidade, capacitando-as para a geração de renda própria.',
      imageUrl: 'https://images.unsplash.com/photo-1524295981977-61874000d15c?q=80&w=800&auto=format&fit=crop',
      benefits: [
        'Produtos ecológicos exclusivos por upcycling',
        'Produção ética que apoia mulheres e mães solo',
        'Brindes personalizados para eventos corporativos',
        'Destinação sustentável e consciente para resíduos têxteis'
      ],
    },
    estudio: {
      title: 'Estúdio Mensageiros Cast',
      tagline: 'Gravação e Audiovisual Profissional',
      description: 'Disponibilizamos nosso estúdio com tratamento acústico de alto nível e equipamentos de ponta para locação comercial. Ideal para gravação de podcasts, audiobooks, dublagem, gravação de cursos digitais e produções de vídeo de curta duração.',
      impactText: 'O valor da locação financia diretamente a manutenção do estúdio e a contratação de instrutores para os nossos cursos de introdução à produção de mídia e som digital voltados para jovens da comunidade no contraturno escolar.',
      imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop',
      benefits: [
        'Microfones e gravadores profissionais (Shure/Rode)',
        'Gravação de vídeo em 4K e iluminação cênica completa',
        'Técnico de áudio dedicado incluso no pacote de locação',
        'Ambiente climatizado e confortável para convidados'
      ],
    },
    esg: {
      title: 'Soluções Corporativas & Palestras ESG',
      tagline: 'Impacto Social e Responsabilidade Social Corporativa',
      description: 'Apoiamos empresas a estruturarem programas internos de impacto social, responsabilidade corporativa e diversidade. Oferecemos palestras motivacionais e técnicas ministradas por nossa diretoria técnica, além de estruturar ações de voluntariado corporativo em nossos polos.',
      impactText: 'Esta iniciativa conecta empresas parceiras à nossa capilaridade comunitária, ajudando a cumprir suas diretrizes ESG e fomentando o investimento social privado sustentável de forma estruturada e legal.',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      benefits: [
        'Palestras personalizadas sobre inclusão de diversidade',
        'Estruturação de programas de voluntariado corporativo',
        'Relatórios de mensuração e impacto auditados para balanço ESG',
        'Alinhamento estratégico aos ODS de impacto comunitário'
      ],
    },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (key: ServiceKey) => {
    setActiveTab(key);
    setFormData((prev) => ({ ...prev, service: key }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    try {
      await submitContactMessageAction({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Orçamento: ${formData.service.toUpperCase()}`,
        message: `Empresa/Organização: ${formData.company || 'Pessoa Física'}\nServiço: ${formData.service}\n\nDetalhes da solicitação:\n${formData.message}`,
      });
    } catch (err) {
      console.warn('handleFormSubmit error:', err);
    }
    setFormState('success');
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      {/* Banner Principal */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight">Negócios Sociais</h1>
          <p className="text-primary-light mt-2 text-lg font-light max-w-xl">
            Iniciativas comerciais de qualidade profissional que financiam e dão sustentabilidade aos nossos projetos sociais.
          </p>
        </div>
      </section>

      {/* Navegação por Abas dos Serviços */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto gap-4 pb-4 border-b border-slate-200 scrollbar-none snap-x">
          <button
            onClick={() => handleTabChange('buffet')}
            type="button"
            className={`flex items-center gap-2.5 px-6 py-4.5 rounded-2xl font-bold text-sm tracking-wide shrink-0 snap-center transition-all ${
              activeTab === 'buffet'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Flame className="h-5 w-5" /> Buffet Social
          </button>
          <button
            onClick={() => handleTabChange('economia-circular')}
            type="button"
            className={`flex items-center gap-2.5 px-6 py-4.5 rounded-2xl font-bold text-sm tracking-wide shrink-0 snap-center transition-all ${
              activeTab === 'economia-circular'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Wrench className="h-5 w-5" /> Economia Circular
          </button>
          <button
            onClick={() => handleTabChange('estudio')}
            type="button"
            className={`flex items-center gap-2.5 px-6 py-4.5 rounded-2xl font-bold text-sm tracking-wide shrink-0 snap-center transition-all ${
              activeTab === 'estudio'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Mic className="h-5 w-5" /> Mensageiros Cast
          </button>
          <button
            onClick={() => handleTabChange('esg')}
            type="button"
            className={`flex items-center gap-2.5 px-6 py-4.5 rounded-2xl font-bold text-sm tracking-wide shrink-0 snap-center transition-all ${
              activeTab === 'esg'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="h-5 w-5" /> Soluções Corporativas ESG
          </button>
        </div>
      </section>

      {/* Detalhe do Negócio Ativo & Formulário de Orçamento */}
      <section className="pb-24 px-4 max-w-7xl mx-auto w-full sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Apresentação Detalhada do Negócio Social */}
          <div className="lg:col-span-7 space-y-10">
            {/* Bloco de Destaque Visual */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-3xl bg-slate-200 border border-slate-200/60 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={businesses[activeTab].imageUrl}
                alt={businesses[activeTab].title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Texto Descritivo */}
            <div className="space-y-4">
              <span className="text-xs font-black tracking-widest text-primary uppercase bg-primary-light px-3 py-1.5 rounded-full">
                {businesses[activeTab].tagline}
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {businesses[activeTab].title}
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {businesses[activeTab].description}
              </p>
            </div>

            {/* Quadro de Impacto Social Revertido */}
            <div className="p-6 bg-secondary-light/30 border-l-4 border-secondary rounded-r-2xl space-y-2">
              <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-secondary" /> Retorno Social Garantido
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {businesses[activeTab].impactText}
              </p>
            </div>

            {/* Benefícios / Diferenciais */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Por que escolher nossa solução?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {businesses[activeTab].benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-light text-primary shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Formulário de Orçamento (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            {formState === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-extrabold text-green-950">Solicitação Enviada!</h3>
                <p className="text-sm text-green-800 leading-relaxed">
                  Recebemos seu pedido de orçamento com sucesso. Um especialista de negócios do <strong>Instituto Inovação Sustentável</strong> (gestor administrativo da nossa OSC) entrará em contato em até <strong>24 horas úteis</strong> via e-mail ou WhatsApp.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setFormState('idle')}
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors focus:outline-none"
                  >
                    Enviar outra solicitação <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md">
                <div className="space-y-2 mb-6">
                  <h3 className="text-lg font-extrabold text-slate-800">
                    Solicite um Orçamento
                  </h3>
                  <p className="text-xs text-slate-500">
                    Preencha o formulário abaixo e receba uma cotação comercial completa para sua empresa ou evento social.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Nome */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Nome do Contato *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Seu nome completo"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>

                  {/* Empresa */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Empresa / Instituição
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Nome da empresa (opcional)"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>

                  {/* E-mail */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      E-mail Corporativo/Pessoal *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu.email@empresa.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      WhatsApp / Celular *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(11) 99999-9999"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>

                  {/* Seletor de Serviço */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Iniciativa de Interesse *
                    </label>
                    <select
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    >
                      <option value="buffet">Buffet Social Doce Mensageiro</option>
                      <option value="economia-circular">Economia Circular & Brindes</option>
                      <option value="estudio">Locação de Estúdio (Mensageiros Cast)</option>
                      <option value="esg">Palestras ESG & Ações Corporativas</option>
                    </select>
                  </div>

                  {/* Detalhes / Mensagem */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Detalhes da Solicitação *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Descreva o tamanho do evento, quantidade de brindes ou detalhes do serviço..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-none"
                    />
                  </div>

                  {/* Botão Enviar */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={formState === 'submitting'}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-white shadow-md shadow-primary/10 hover:bg-primary-hover active:scale-[0.98] transition-all focus:outline-none"
                    >
                      {formState === 'submitting' ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Enviando Solicitação...
                        </>
                      ) : (
                        <>
                          Solicitar Orçamento
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
