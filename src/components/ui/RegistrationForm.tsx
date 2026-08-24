'use client';

import React, { useState } from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface RegistrationFormProps {
  eventTitle: string;
  statusText: 'inscricoes-abertas' | 'lista-espera' | 'encerrado';
}

export default function RegistrationForm({ eventTitle, statusText }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
  });

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (statusText === 'encerrado') return;

    setFormState('submitting');
    
    // Simula envio de requisição (1.5 segundos)
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  if (formState === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-3xl p-8 text-center space-y-4 animate-fade-in shadow-inner">
        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-extrabold text-green-950">Inscrição Recebida!</h3>
        <p className="text-sm text-green-800 max-w-md mx-auto leading-relaxed">
          Sua inscrição para <strong>{eventTitle}</strong> foi enviada com sucesso. 
          {statusText === 'lista-espera' 
            ? ' Como este curso está em lista de espera, nossa equipe entrará em contato via WhatsApp caso surja uma vaga.'
            : ' O comprovante e as instruções de início das aulas foram enviados para o seu e-mail.'}
        </p>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-200/50 px-3.5 py-1.5 rounded-full">
            <Sparkles className="h-3.5 w-3.5" /> Entraremos em contato em breve
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md">
      <div className="space-y-2 mb-6">
        <h3 className="text-lg font-extrabold text-slate-800">
          {statusText === 'lista-espera' ? 'Fila de Espera' : 'Formulário de Inscrição'}
        </h3>
        <p className="text-xs text-slate-500">
          {statusText === 'lista-espera' 
            ? 'Inscreva-se na lista de espera para ser notificado em caso de novas turmas ou desistências.'
            : 'Preencha seus dados cadastrais obrigatórios para garantir sua vaga gratuita.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Nome Completo *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite seu nome completo"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>

        {/* E-mail */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Endereço de E-mail *
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="exemplo@email.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Telefone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              WhatsApp / Celular *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
            />
          </div>

          {/* Data de Nascimento */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Data de Nascimento *
            </label>
            <input
              type="date"
              name="birthDate"
              required
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* CPF */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            CPF (Apenas Números) *
          </label>
          <input
            type="text"
            name="cpf"
            required
            pattern="\d{11}"
            maxLength={11}
            value={formData.cpf}
            onChange={handleChange}
            placeholder="00000000000"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>

        {/* Botão Enviar */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={formState === 'submitting' || statusText === 'encerrado'}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white shadow-md transition-all focus:outline-none ${
              statusText === 'lista-espera'
                ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/10'
                : 'bg-primary hover:bg-primary-hover shadow-primary/10'
            }`}
          >
            {formState === 'submitting' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Enviando Inscrição...
              </>
            ) : statusText === 'lista-espera' ? (
              'Solicitar Lista de Espera'
            ) : (
              'Confirmar Matrícula Gratuita'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
