'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  Users, 
  Briefcase, 
  ShoppingBag, 
  CheckCircle2, 
  Loader2, 
  Copy, 
  Check, 
  Sparkles,
  Smartphone,
  Info
} from 'lucide-react';

export default function FacaPartePage() {
  // Estados de Doação
  const [donationType, setDonationType] = useState<'pontual' | 'recorrente'>('pontual');
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Estados dos Formulários
  const [volunteerState, setVolunteerState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    areas: [] as string[],
    shifts: [] as string[],
  });

  const [companyState, setCompanyState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    cnpj: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
  });

  // Equivalência de custos médios reais por participante
  const equivalencias = [
    { area: 'Gastronomia (Cozinha-Escola)', valor: 'R$ 800', desc: 'Cobre todo o custo de insumos alimentícios, avental, materiais e taxa de certificação de um formando.' },
    { area: 'Audiovisual (Mensageiros Cast)', valor: 'R$ 600', desc: 'Subsidia os materiais digitais, mentoria especializada e energia do estúdio para um jovem estudante.' },
    { area: 'Assistencial (Ações Sociais)', valor: 'R$ 300', desc: 'Garante o acolhimento psicossocial mensal de uma família e provimento de cesta básica emergencial.' },
  ];

  // Chave Pix Copia e Cola Fictícia baseada no telefone 5511959907614
  const pixCode = '00020126360014br.gov.bcb.pix01145511959907614520400005303986540550.005802BR5925Mensageiros da Esperanca6009Sao Paulo62070503***6304ABCD';

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVolunteerState('submitting');
    setTimeout(() => setVolunteerState('success'), 1500);
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyState('submitting');
    setTimeout(() => setCompanyState('success'), 1500);
  };

  const handleAreaChange = (area: string) => {
    setVolunteerForm(prev => {
      const exists = prev.areas.includes(area);
      return {
        ...prev,
        areas: exists ? prev.areas.filter(a => a !== area) : [...prev.areas, area]
      };
    });
  };

  const handleShiftChange = (shift: string) => {
    setVolunteerForm(prev => {
      const exists = prev.shifts.includes(shift);
      return {
        ...prev,
        shifts: exists ? prev.shifts.filter(s => s !== shift) : [...prev.shifts, shift]
      };
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      {/* Banner Principal */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight">Faça Parte da Solução</h1>
          <p className="text-primary-light mt-2 text-lg font-light max-w-xl">
            Descubra como você pode apoiar os Mensageiros da Esperança por meio de doações, voluntariado ou parcerias ESG.
          </p>
        </div>
      </section>

      {/* Seção 1: Doações */}
      <section id="doar" className="py-20 px-4 max-w-7xl mx-auto w-full sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-sm font-extrabold text-secondary uppercase tracking-widest flex items-center justify-center gap-1">
            <Heart className="h-4 w-4 text-secondary fill-current" /> Doações
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Sua Contribuição Financeira
          </h2>
          <div className="h-1 w-16 bg-secondary mx-auto rounded-full" />
          <p className="text-slate-600 text-sm">
            Escolha como prefere investir no desenvolvimento de nossas famílias.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Formulário Interativo de Doação */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
            
            {/* Tipo de Doação */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setDonationType('pontual')}
                className={`flex-1 py-3 text-center text-sm font-bold rounded-xl transition-all ${
                  donationType === 'pontual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Doação Única (Pontual)
              </button>
              <button
                type="button"
                onClick={() => setDonationType('recorrente')}
                className={`flex-1 py-3 text-center text-sm font-bold rounded-xl transition-all ${
                  donationType === 'recorrente' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Apoiar Mensalmente (Recorrente)
              </button>
            </div>

            {/* Seleção de Valores */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Escolha o valor da doação
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[30, 50, 100].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(val);
                      setCustomAmount('');
                    }}
                    className={`py-4 rounded-xl border text-base font-extrabold transition-all focus:outline-none ${
                      selectedAmount === val && !customAmount
                        ? 'border-primary bg-primary-light text-primary ring-2 ring-primary/20'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    R$ {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Valor Customizado */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Ou digite outro valor
              </label>
              <div className="relative rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-slate-400">R$</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(0);
                  }}
                  placeholder="Outro valor"
                  className="w-full pl-10 pr-4 py-4 text-sm text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Chave Pix e QR Code */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Chave PIX CNPJ</h4>
                  <p className="text-xs text-slate-500">Chave Celular: 11959907614</p>
                </div>
              </div>

              {/* Botão Copiar Código Pix */}
              <button
                type="button"
                onClick={copyPixCode}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-primary/40 bg-primary-light/40 text-primary font-bold text-xs sm:text-sm hover:bg-primary-light/60 transition-colors focus:outline-none"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4.5 w-4.5 text-green-600" />
                    Pix Copiado com Sucesso!
                  </>
                ) : (
                  <>
                    <Copy className="h-4.5 w-4.5" />
                    Copiar Código PIX (Copia e Cola)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Custos por Participante (Lateral) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest text-primary-light uppercase">
                  Transparência de Custos
                </span>
                <h3 className="text-xl font-extrabold tracking-tight">
                  Para onde vai sua doação?
                </h3>
              </div>

              <div className="space-y-5">
                {equivalencias.map((eq, idx) => (
                  <div key={idx} className="space-y-1.5 border-l-2 border-primary-light/50 pl-4 py-0.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200 text-xs sm:text-sm">{eq.area}</span>
                      <span className="font-extrabold text-primary-light text-sm sm:text-base">{eq.valor}</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {eq.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 p-4 bg-slate-800/80 rounded-xl items-start">
                <Info className="h-4.5 w-4.5 text-primary-light shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Os valores representam o custo integral médio por participante ao mês. As doações compõem o Fundo Geral que financia 100% das oficinas e assistência social.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção 2: Seja Voluntário */}
      <section id="voluntariado" className="py-20 bg-white border-t border-b border-slate-200/50 px-4">
        <div className="max-w-7xl mx-auto w-full sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Texto de Apresentação */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-sm font-extrabold text-secondary uppercase tracking-widest flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5 text-secondary" /> Voluntariado
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Doe seu tempo e habilidades
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                O voluntariado é o coração da nossa organização. Seja ensinando, prestando atendimento psicossocial ou ajudando na logística de nossos bazares e eventos, sua presença gera valor comunitário imediato.
              </p>
              <div className="p-4 bg-primary-light/40 border-l-4 border-primary rounded-r-xl">
                <p className="text-xs text-primary-hover font-bold italic leading-relaxed">
                  &ldquo;Você não faz parte do problema, mas pode fazer parte da solução!&rdquo;
                </p>
              </div>
            </div>

            {/* Formulário de Voluntário */}
            <div className="lg:col-span-7 bg-neutral-bg p-8 rounded-3xl border border-slate-200/80 shadow-inner">
              {volunteerState === 'success' ? (
                <div className="bg-green-50 border border-green-200 rounded-3xl p-8 text-center space-y-4">
                  <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-extrabold text-green-950">Inscrição Cadastrada!</h3>
                  <p className="text-sm text-green-800 leading-relaxed">
                    Seu formulário de voluntariado foi registrado com sucesso. Nossa coordenação social entrará em contato via e-mail ou WhatsApp para agendar sua entrevista de integração.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                  <h3 className="font-extrabold text-slate-800 text-lg mb-2">Inscrição Voluntária</h3>
                  
                  {/* Nome */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      value={volunteerForm.name}
                      onChange={(e) => setVolunteerForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome completo"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* E-mail */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">E-mail *</label>
                      <input
                        type="email"
                        required
                        value={volunteerForm.email}
                        onChange={(e) => setVolunteerForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="seu@email.com"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={volunteerForm.phone}
                        onChange={(e) => setVolunteerForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* CPF */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">CPF *</label>
                    <input
                      type="text"
                      required
                      pattern="\d{11}"
                      maxLength={11}
                      value={volunteerForm.cpf}
                      onChange={(e) => setVolunteerForm(prev => ({ ...prev, cpf: e.target.value }))}
                      placeholder="Apenas números (11 dígitos)"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>

                  {/* Áreas de Atuação */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Áreas de Interesse (Selecione ao menos uma)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { key: 'gastronomia', label: 'Cozinha e Panificação' },
                        { key: 'ti', label: 'TI e Inclusão Digital' },
                        { key: 'letramento', label: 'Letramento e Apoio Escolar' },
                        { key: 'bazar', label: 'Logística de Bazar e Eventos' },
                        { key: 'gestao', label: 'Suporte de Gestão e Mídias' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer text-xs font-bold text-slate-600 hover:bg-slate-50">
                          <input
                            type="checkbox"
                            checked={volunteerForm.areas.includes(item.key)}
                            onChange={() => handleAreaChange(item.key)}
                            className="rounded text-primary focus:ring-primary h-4 w-4"
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Turnos disponíveis */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Disponibilidade de Turno</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { key: 'manha', label: 'Manhã' },
                        { key: 'tarde', label: 'Tarde' },
                        { key: 'noite', label: 'Noite' },
                        { key: 'sabado', label: 'Sábados' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer text-xs font-bold text-slate-600 hover:bg-slate-50">
                          <input
                            type="checkbox"
                            checked={volunteerForm.shifts.includes(item.key)}
                            onChange={() => handleShiftChange(item.key)}
                            className="rounded text-primary focus:ring-primary h-4 w-4"
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Botão Submeter */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={volunteerState === 'submitting'}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/10 hover:bg-primary-hover transition-all focus:outline-none"
                    >
                      {volunteerState === 'submitting' ? (
                        <>
                          <Loader2 className="h-4.5 w-4.5 animate-spin" />
                          Enviando Inscrição...
                        </>
                      ) : (
                        'Cadastrar como Voluntário'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Seção 3: Empresas Parceiras (ESG) */}
      <section id="empresas" className="py-20 px-4 max-w-7xl mx-auto w-full sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Apresentação Corporativa */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-sm font-extrabold text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <Briefcase className="h-4.5 w-4.5 text-secondary" /> Empresas Parceiras
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Investimento Social e Selo ESG de Impacto Sistêmico
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Conecte sua marca a projetos auditados que promovem de forma real os Objetivos de Desenvolvimento Sustentável (ODS) em comunidades vulneráveis da Grande São Paulo. 
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Nossa organização oferece às empresas mantenedoras o **Selo de Impacto Sistêmico** (cotas de patrocínio a partir de **R$ 15.000 / ano**), com envio de relatórios quadrimestrais detalhados com indicadores sociais quantitativos validados pelo **Instituto Inovação Sustentável** para inserção direta no Balanço Social e ESG corporativo.
            </p>
            
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary-light px-3.5 py-2.5 rounded-full">
                <Sparkles className="h-4.5 w-4.5 text-secondary animate-pulse" /> Cotas e Selos ESG a partir de R$ 15.000/ano
              </span>
            </div>
          </div>

          {/* Formulário Empresas */}
          <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md">
            {companyState === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-3xl p-8 text-center space-y-4">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-extrabold text-green-950">Contato Recebido!</h3>
                <p className="text-sm text-green-800 leading-relaxed">
                  Agradecemos o interesse corporativo. A coordenação de parcerias e relações corporativas do **Instituto Inovação Sustentável** entrará em contato em até **48 horas úteis** com uma proposta de aliança estratégica.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCompanySubmit} className="space-y-4">
                <h3 className="font-extrabold text-slate-800 text-base mb-2">Fale com Relações Corporativas</h3>

                {/* Nome da Empresa */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Razão Social / Nome da Empresa *</label>
                  <input
                    type="text"
                    required
                    value={companyForm.companyName}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Nome da empresa"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CNPJ */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">CNPJ *</label>
                    <input
                      type="text"
                      required
                      value={companyForm.cnpj}
                      onChange={(e) => setCompanyForm(prev => ({ ...prev, cnpj: e.target.value }))}
                      placeholder="00.000.000/0000-00"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>

                  {/* Nome Contato */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Nome do Contato *</label>
                    <input
                      type="text"
                      required
                      value={companyForm.contactName}
                      onChange={(e) => setCompanyForm(prev => ({ ...prev, contactName: e.target.value }))}
                      placeholder="Nome do representante"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* E-mail */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">E-mail Corporativo *</label>
                    <input
                      type="email"
                      required
                      value={companyForm.email}
                      onChange={(e) => setCompanyForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="representante@empresa.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>

                  {/* Telefone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Telefone Comercial *</label>
                    <input
                      type="tel"
                      required
                      value={companyForm.phone}
                      onChange={(e) => setCompanyForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Mensagem */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Detalhes da Parceria *</label>
                  <textarea
                    required
                    rows={3}
                    value={companyForm.message}
                    onChange={(e) => setCompanyForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Descreva o escopo da parceria ou cota de interesse..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Botão Enviar */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={companyState === 'submitting'}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/10 hover:bg-primary-hover transition-all focus:outline-none"
                  >
                    {companyState === 'submitting' ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        Enviando Mensagem...
                      </>
                    ) : (
                      'Solicitar Proposta ESG'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Seção 4: Doação de Insumos */}
      <section id="insumos" className="py-20 bg-white border-t border-slate-200/50 px-4">
        <div className="max-w-7xl mx-auto w-full sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-sm font-extrabold text-secondary uppercase tracking-widest flex items-center justify-center gap-1.5">
              <ShoppingBag className="h-4.5 w-4.5 text-secondary" /> Insumos Físicos
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Doação de Materiais e Alimentos
            </h2>
            <div className="h-1 w-16 bg-secondary mx-auto rounded-full" />
            <p className="text-slate-600 text-sm">
              Também recebemos suprimentos físicos fundamentais para a manutenção diária das nossas sedes e oficinas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Gastronômico */}
            <div className="bg-neutral-bg p-8 rounded-3xl border border-slate-200/50 space-y-4">
              <h4 className="font-extrabold text-slate-800 text-base">Insumos para Gastronomia</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Alimentos não perecíveis (arroz, feijão, óleo, farinha de trigo de alta qualidade, fermento) destinados às oficinas da Cozinha-Escola Doce Mensageiro e para a montagem de marmitas sociais distribuídas à comunidade.
              </p>
            </div>

            {/* Tecnológico */}
            <div className="bg-neutral-bg p-8 rounded-3xl border border-slate-200/50 space-y-4">
              <h4 className="font-extrabold text-slate-800 text-base">Computadores e Periféricos</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Computadores, notebooks, monitores LCD e teclados novos ou usados (em perfeitas condições de uso) para a reposição de equipamentos em nossas salas de TI e polos de inclusão digital em Osasco e na Lapa.
              </p>
            </div>

            {/* Roupas e Bazar */}
            <div className="bg-neutral-bg p-8 rounded-3xl border border-slate-200/50 space-y-4">
              <h4 className="font-extrabold text-slate-800 text-base">Vestuários e Utensílios para Bazar</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Roupas masculinas, femininas, infantis, calçados e utensílios domésticos em excelente estado de conservação, destinados ao nosso Bazar Beneficente permanente para captação de fundos operacionais da OSC.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
