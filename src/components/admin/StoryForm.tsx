'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2,
  Image, Link2, User, ShieldCheck, Quote, Heart
} from 'lucide-react';
import { ImpactStory } from '@/types';
import { saveStoryAction } from '@/app/admin/historias/actions';

interface StoryFormProps {
  initialData?: ImpactStory | null;
}

export default function StoryForm({ initialData }: StoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState(initialData?.name ?? '');
  const [age, setAge] = useState<string>(initialData?.age?.toString() ?? '');
  const [role, setRole] = useState<ImpactStory['role']>(initialData?.role ?? 'participante');
  const [project, setProject] = useState(initialData?.project ?? '');
  const [quote, setQuote] = useState(initialData?.quote ?? '');
  const [story, setStory] = useState(initialData?.story ?? '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? '');
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl ?? '');
  const [lgpdConsent, setLgpdConsent] = useState(initialData?.lgpdConsent ?? false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!lgpdConsent) {
      setServerError('A autorização de uso de imagem e depoimento (LGPD) é obrigatória.');
      return;
    }
    if (!name.trim() || !project.trim() || !quote.trim() || !story.trim() || !imageUrl.trim()) {
      setServerError('Preencha todos os campos obrigatórios (*) antes de salvar.');
      return;
    }

    setIsLoading(true);
    try {
      await saveStoryAction({
        id: initialData?.id ?? '',
        name,
        age: age ? parseInt(age, 10) : undefined,
        role,
        project,
        quote,
        story,
        imageUrl,
        videoUrl: videoUrl.trim() || undefined,
        lgpdConsent,
      });
      setSuccess(true);
      setTimeout(() => router.push('/admin/historias'), 1200);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erro inesperado ao salvar.');
      setIsLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all";
  const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/historias" className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-800">
            {initialData ? 'Editar História' : 'Nova História de Transformação'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Preencha os dados do relato e confirme a autorização LGPD.</p>
        </div>
      </div>

      {/* Feedback */}
      {serverError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 items-start">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-800 font-bold">{serverError}</p>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex gap-3 items-start">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-800 font-bold">História salva com sucesso! Redirecionando...</p>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        {/* Nome, Idade, Cargo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className={labelClass}><User className="inline h-3 w-3 mr-1" />Nome Completo *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Maria da Silva" className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Idade (opcional)</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Ex: 42" min={1} max={120} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}><Heart className="inline h-3 w-3 mr-1" />Perfil / Categoria *</label>
            <select value={role} onChange={(e) => setRole(e.target.value as ImpactStory['role'])} className={inputClass} required>
              <option value="participante">Participante</option>
              <option value="empreendedor">Empreendedor(a)</option>
              <option value="voluntario">Voluntário(a) / Educador(a)</option>
              <option value="parceiro">Parceiro(a)</option>
            </select>
          </div>
        </div>

        {/* Projeto */}
        <div>
          <label className={labelClass}>Papel / Projeto Relacionado *</label>
          <input
            type="text"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Ex: Aluna da Cozinha-Escola Doce Mensageiro"
            className={inputClass}
            required
          />
        </div>

        {/* Quote */}
        <div>
          <label className={labelClass}><Quote className="inline h-3 w-3 mr-1" />Frase em Destaque (Quote) *</label>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={2}
            placeholder={`"A frase mais impactante e inspiradora que resume a transformação desta pessoa..."`}
            className={`${inputClass} resize-none italic`}
            required
          />
        </div>

        {/* Relato */}
        <div>
          <label className={labelClass}>Relato Completo *</label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={6}
            placeholder="Descreva a trajetória completa da pessoa, sua situação antes de chegar à OSC, o que mudou e qual impacto teve em sua vida..."
            className={`${inputClass} resize-y leading-relaxed`}
            required
          />
          <p className="text-[10px] text-slate-400 mt-1">{story.length} caracteres</p>
        </div>

        {/* Foto e Vídeo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}><Image className="inline h-3 w-3 mr-1" />URL da Foto Autorizada *</label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className={inputClass} required />
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Preview" className="mt-2 h-24 w-24 rounded-full object-cover border-2 border-slate-200" onError={(e) => (e.currentTarget.style.display = 'none')} />
            )}
          </div>
          <div>
            <label className={labelClass}><Link2 className="inline h-3 w-3 mr-1" />Link de Vídeo (YouTube/Vimeo — opcional)</label>
            <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className={inputClass} />
          </div>
        </div>

        {/* LGPD — Obrigatório */}
        <div className={`p-5 rounded-2xl border-2 transition-colors ${lgpdConsent ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-200'}`}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={lgpdConsent}
              onChange={(e) => setLgpdConsent(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer shrink-0"
              required
            />
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className={`h-4 w-4 ${lgpdConsent ? 'text-emerald-600' : 'text-rose-500'}`} />
                <span className={`text-sm font-bold ${lgpdConsent ? 'text-emerald-800' : 'text-rose-700'}`}>
                  Autorização LGPD — Obrigatória *
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Confirmo que o uso da imagem, nome e depoimento desta pessoa foi devidamente autorizado por escrito, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei n° 13.709/2018) e a política institucional de proteção de dados da OSC Mensageiros da Esperança.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Botão */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || success || !lgpdConsent}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isLoading ? 'Salvando...' : 'Salvar História'}
        </button>
      </div>
    </form>
  );
}
