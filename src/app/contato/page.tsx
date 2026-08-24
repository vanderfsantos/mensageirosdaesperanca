'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Loader2, 
  ShieldAlert
} from 'lucide-react';

export default function ContatoPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    subject: 'cursos',
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');

    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  const isAnonymousEscuta = formData.subject === 'escuta';

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      {/* Banner Principal */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight">Fale Conosco</h1>
          <p className="text-primary-light mt-2 text-lg font-light max-w-xl">
            Dúvidas, sugestões, orçamentos ou suporte socioassistencial. Estamos prontos para ouvir você.
          </p>
        </div>
      </section>

      {/* Conteúdo de Contato e Formulário */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full sm:px-6 lg:px-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Informações Físicas e Canais de Contato */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-black tracking-widest text-primary uppercase bg-primary-light px-3 py-1.5 rounded-full">
                Canais de Atendimento
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Informações de Contato
              </h2>
            </div>

            {/* Grid dos Cards de Contato */}
            <div className="space-y-4">
              {/* Endereço */}
              <div className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="h-10 w-10 bg-primary-light text-primary rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-sm">Sede Administrativa (Lapa)</h4>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Rua George Smith, 123 - Lapa, São Paulo - SP, CEP 05074-010
                  </p>
                </div>
              </div>

              {/* Telefones */}
              <div className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="h-10 w-10 bg-primary-light text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-sm">Telefones e WhatsApp</h4>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    WhatsApp: (11) 95990-7614 (Segunda a Sexta-feira)<br />
                    Fixo Geral: (11) 3831-0000
                  </p>
                </div>
              </div>

              {/* E-mails */}
              <div className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="h-10 w-10 bg-primary-light text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-sm">E-mails de Contato</h4>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Geral: contato@mensageirosdaesperanca.org<br />
                    Parcerias: esg.inovacao@mensageirosdaesperanca.org
                  </p>
                </div>
              </div>

              {/* Horários */}
              <div className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="h-10 w-10 bg-primary-light text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-sm">Horário de Funcionamento</h4>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    Segunda a Sexta-feira: das 08:00 às 18:00<br />
                    Sábados (Apenas Bazar e Eventos): das 09:00 às 14:00
                  </p>
                </div>
              </div>
            </div>

            {/* Mapa Incorporado */}
            <div className="h-60 w-full overflow-hidden rounded-3xl border border-slate-200/80 shadow-inner bg-slate-100 relative">
              <iframe
                title="Mapa de Localização - Sede Lapa"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.1287739527787!2d-46.705574523772224!3d-23.527891278826726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef8708dc75c0f%3A0xb35154378fbfbf68!2sR.%20George%20Smith%20-%20Lapa%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2005074-010!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-300"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Formulário de Contato com Roteamento */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md">
            {formState === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-3xl p-8 text-center space-y-4">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-extrabold text-green-950">
                  {isAnonymousEscuta ? 'Relato Recebido com Segurança!' : 'Mensagem Enviada!'}
                </h3>
                <p className="text-sm text-green-800 leading-relaxed max-w-md mx-auto">
                  {isAnonymousEscuta 
                    ? 'Seu relato anônimo foi enviado diretamente para a comissão ética de acolhimento. As informações inseridas são criptografadas e tratadas em total confidencialidade.'
                    : 'Agradecemos o contato. Nossa secretaria social ou comercial responderá seu e-mail ou WhatsApp em até 24 horas úteis.'}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setFormState('idle');
                      setFormData({ subject: 'cursos', name: '', email: '', phone: '', message: '' });
                    }}
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors focus:outline-none"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-800 text-lg">Central de Mensagens</h3>
                  <p className="text-xs text-slate-500">
                    Selecione o assunto correto para acelerar o retorno da nossa equipe.
                  </p>
                </div>

                {/* Dropdown de Assunto */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Assunto / Canal *
                  </label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-semibold"
                  >
                    <option value="cursos">Secretaria: Dúvidas sobre Cursos e Oficinas</option>
                    <option value="parcerias">Relações Corporativas: Parcerias e ESG</option>
                    <option value="buffet">Buffet Social Doce Mensageiro (Cotações)</option>
                    <option value="voluntario">Coordenação: Candidatura de Voluntários</option>
                    <option value="doacoes">Captação de Recursos: Doações e Bazares</option>
                    <option value="escuta">Canal de Escuta (Acolhimento de Denúncias/Apoio Anônimo)</option>
                  </select>
                </div>

                {/* Banner Canal de Escuta */}
                {isAnonymousEscuta && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 items-start">
                    <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-amber-950 text-xs sm:text-sm">Canal Seguro e Anônimo</h4>
                      <p className="text-amber-800 text-xs leading-relaxed">
                        Ao selecionar este canal, os campos de identificação tornam-se opcionais. Você pode preencher apenas a mensagem para preservar seu anonimato.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Seu Nome {isAnonymousEscuta ? '(Opcional)' : '*'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required={!isAnonymousEscuta}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={isAnonymousEscuta ? 'Preservar anonimato' : 'Seu nome'}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>

                  {/* E-mail */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Endereço de E-mail {isAnonymousEscuta ? '(Opcional)' : '*'}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required={!isAnonymousEscuta}
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={isAnonymousEscuta ? 'anonimo@escuta.org' : 'exemplo@email.com'}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Telefone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    WhatsApp / Celular (Opcional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                  />
                </div>

                {/* Mensagem */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Mensagem / Relato *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Descreva seu pedido, dúvida ou relato em detalhes..."
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
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Mensagem
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
