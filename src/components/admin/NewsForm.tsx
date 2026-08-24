'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2,
  Link2, Image, User, Calendar, Tag, Star
} from 'lucide-react';
import { NewsPost } from '@/types';
import { saveNewsAction } from '@/app/admin/noticias/actions';

const CATEGORIES = [
  'Cursos', 'Eventos e Campanhas', 'Parcerias', 'Impacto', 'Artigos', 'Imprensa',
] as const;

const slugify = (text: string) =>
  text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');

interface NewsFormProps {
  initialData?: NewsPost | null;
}

export default function NewsForm({ initialData }: NewsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '');
  const [category, setCategory] = useState<NewsPost['category']>(initialData?.category ?? 'Impacto');
  const [author, setAuthor] = useState(initialData?.author ?? '');
  const [date, setDate] = useState(initialData?.date ?? new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.',''));
  const [content, setContent] = useState(initialData?.content ?? '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? '');
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [publishedStatus, setPublishedStatus] = useState<NewsPost['publishedStatus']>(initialData?.publishedStatus ?? 'rascunho');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!initialData) setSlug(slugify(e.target.value));
  };

  const handleSubmit = async (status: 'publicado' | 'rascunho') => {
    setIsLoading(true);
    setServerError(null);

    if (!title.trim() || !slug.trim() || !excerpt.trim() || !content.trim() || !imageUrl.trim() || !author.trim()) {
      setServerError('Preencha todos os campos obrigatórios antes de salvar.');
      setIsLoading(false);
      return;
    }

    try {
      await saveNewsAction({
        id: initialData?.id ?? '',
        slug, title, excerpt, content, imageUrl,
        category, author, date,
        featured,
        publishedStatus: status,
      });
      setSuccess(true);
      setTimeout(() => router.push('/admin/noticias'), 1200);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erro inesperado ao salvar.');
      setIsLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all";
  const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/noticias" className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-800">{initialData ? 'Editar Notícia' : 'Nova Notícia'}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Preencha todos os campos e escolha o status de publicação.</p>
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
          <p className="text-xs text-emerald-800 font-bold">Notícia salva com sucesso! Redirecionando...</p>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        {/* Título e Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Título *</label>
            <input type="text" value={title} onChange={handleTitleChange} placeholder="Ex: Mensageiros inaugura..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Slug (URL) *</label>
            <div className="relative">
              <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="mensageiros-inaugura" className={`${inputClass} pl-10`} />
            </div>
          </div>
        </div>

        {/* Resumo */}
        <div>
          <label className={labelClass}>Resumo / Lead para SEO *</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Breve descrição exibida nos cards e metadados SEO (máx. 200 caracteres recomendado)..."
            className={`${inputClass} resize-none`}
          />
          <p className="text-[10px] text-slate-400 mt-1">{excerpt.length} caracteres</p>
        </div>

        {/* Categoria, Autor, Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}><Tag className="inline h-3 w-3 mr-1" />Categoria *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as NewsPost['category'])} className={inputClass}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}><User className="inline h-3 w-3 mr-1" />Autor *</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nome do redator" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}><Calendar className="inline h-3 w-3 mr-1" />Data de Publicação *</label>
            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Ex: 24 Ago 2026" className={inputClass} />
          </div>
        </div>

        {/* URL da Imagem */}
        <div>
          <label className={labelClass}><Image className="inline h-3 w-3 mr-1" />URL da Imagem de Capa *</label>
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." className={inputClass} />
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-xl border border-slate-200" onError={(e) => (e.currentTarget.style.display = 'none')} />
          )}
        </div>

        {/* Conteúdo */}
        <div>
          <label className={labelClass}>Conteúdo da Notícia *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder="Escreva o conteúdo completo da notícia aqui. Suporte a Markdown."
            className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
          />
          <p className="text-[10px] text-slate-400 mt-1">Suporte a Markdown. {content.length} caracteres.</p>
        </div>

        {/* Destaque */}
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-amber-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
          />
          <label htmlFor="featured" className="flex items-center gap-2 cursor-pointer">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-bold text-amber-800">Destacar na Home</span>
            <span className="text-xs text-amber-600">(aparece na seção de destaque da página inicial)</span>
          </label>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center gap-3 justify-end">
        <button
          type="button"
          onClick={() => handleSubmit('rascunho')}
          disabled={isLoading || success}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar como Rascunho
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('publicado')}
          disabled={isLoading || success}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Publicar Agora
        </button>
      </div>
    </div>
  );
}
