'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  AlertCircle, 
  Link2
} from 'lucide-react';
import { CourseEvent } from '@/types';
import { saveCourseAction } from '@/app/admin/agenda/actions';

// Utilitário para gerar Slug amigável
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Esquema de Validação Zod estrito de acordo com a interface CourseEvent
const courseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, 'O título deve ter no mínimo 5 caracteres.'),
  slug: z.string().min(3, 'O slug deve ser preenchido e ter no mínimo 3 caracteres.'),
  category: z.enum(['capacitacao', 'socioeducativo', 'comunidade', 'evento']),
  locationName: z.string().min(1, 'Selecione a unidade física de atendimento.'),
  shift: z.enum(['manha', 'tarde', 'noite', 'sabado']),
  modality: z.enum(['presencial', 'online']),
  statusText: z.enum(['inscricoes-abertas', 'lista-espera', 'encerrado']),
  workloadVal: z.coerce.number().min(1, 'Carga horária mínima é 1 hora.'),
  date: z.string().min(3, 'A data ou previsão de início é obrigatória (ex: Início: Março 2026).'),
  description: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres.'),
  syllabusText: z.string().min(5, 'Descreva pelo menos um item do conteúdo programático.'),
  registrationLink: z.string().url('A URL do formulário externo deve ser válida.').optional().or(z.literal('')),
  imageUrl: z.string().min(1, 'A URL da imagem é obrigatória.').refine(
    (val) => val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'),
    'A imagem deve ser um link válido (https://...) ou uma foto interna (/images/...)'
  ),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  initialData?: CourseEvent | null;
}

const oscPhotos = [
  { label: '🧵 Artesanato & Bazar', url: '/images/content/oficina-artesanato.jpg' },
  { label: '🥖 Panificação & Cozinha', url: '/images/content/cozinha-escola-turma.jpg' },
  { label: '👩‍🍳 Gastronomia Prática', url: '/images/content/oficina-gastronomia-pratica.jpg' },
  { label: '⚽ Esportes & Lazer', url: '/images/content/jogos-osasco.jpg' },
  { label: '🎙️ Mensageiros Cast', url: '/images/content/mensageiros-cast-estudio.jpg' },
  { label: '🏛️ Sede Lapa', url: '/images/content/sede-lapa-fachada.jpg' },
  { label: '🏠 Casinha Azul', url: '/images/content/casinha-azul.jpg' },
  { label: '🛍️ Bazar (Unsplash)', url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop' },
];

export default function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Extrai número inteiro de workload (ex: "40 horas" -> 40)
  const parseWorkload = (workloadStr: string): number => {
    const parsed = parseInt(workloadStr, 10);
    return isNaN(parsed) ? 40 : parsed;
  };

  const defaultValues: CourseFormData = initialData ? {
    id: initialData.id,
    title: initialData.title,
    slug: initialData.slug,
    category: initialData.category,
    locationName: initialData.locationName,
    shift: initialData.shift,
    modality: initialData.modality,
    statusText: initialData.statusText,
    workloadVal: parseWorkload(initialData.workload),
    date: initialData.date,
    description: initialData.description,
    syllabusText: initialData.syllabus.join('\n'),
    registrationLink: initialData.registrationLink || '',
    imageUrl: initialData.imageUrl,
  } : {
    title: '',
    slug: '',
    category: 'capacitacao',
    locationName: 'Sede Lapa',
    shift: 'manha',
    modality: 'presencial',
    statusText: 'inscricoes-abertas',
    workloadVal: 40,
    date: '',
    description: '',
    syllabusText: '',
    registrationLink: '',
    imageUrl: '/images/content/cozinha-escola-turma.jpg',
  };

  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors } 
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues
  });

  const currentImageUrl = watch('imageUrl');

  // Atualiza automaticamente o slug ao digitar o título
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value;
    setValue('title', titleVal, { shouldValidate: true });
    setValue('slug', slugify(titleVal), { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<CourseFormData> = async (formData) => {
    setIsLoading(true);
    setServerError(null);

    // Mapeia o syllabusText (quebras de linha) para um array de strings
    const syllabus = formData.syllabusText
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    // Mapeamento técnico do status baseado no statusText
    const technicalStatus: 'upcoming' | 'ongoing' | 'completed' = 
      formData.statusText === 'encerrado' ? 'completed' : 'upcoming';

    try {
      await saveCourseAction({
        id: formData.id,
        slug: formData.slug,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.modality === 'online' ? 'Online' : 'Presencial',
        locationName: formData.locationName,
        imageUrl: formData.imageUrl,
        category: formData.category,
        status: technicalStatus,
        statusText: formData.statusText,
        workload: `${formData.workloadVal} horas`,
        modality: formData.modality,
        shift: formData.shift,
        syllabus,
        registrationLink: formData.registrationLink || undefined,
      });

      router.push('/admin/agenda');
      router.refresh();
    } catch (err: unknown) {
      setServerError((err as Error).message || 'Falha ao salvar as informações do curso.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Form */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/agenda')}
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {initialData ? 'Editar Oportunidade' : 'Novo Curso / Evento'}
          </h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            {initialData ? `ID: ${initialData.id}` : 'Cadastro de Agenda Pública'}
          </p>
        </div>
      </div>

      {serverError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 items-start animate-fade-in">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-800 font-bold leading-relaxed">{serverError}</p>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        
        {/* Bloco 1: Título e Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Título do Curso ou Oficina *
            </label>
            <input
              type="text"
              {...register('title')}
              onChange={handleTitleChange}
              placeholder="Ex: Introdução à Confeitaria Artesanal"
              className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all ${
                errors.title ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.title && (
              <span className="text-[10px] text-rose-500 font-bold">{errors.title.message}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Slug da URL *
            </label>
            <input
              type="text"
              {...register('slug')}
              placeholder="confeitaria-artesanal"
              className={`w-full rounded-xl border bg-slate-100 px-4 py-3 text-sm text-slate-500 placeholder-slate-400 focus:outline-none transition-all ${
                errors.slug ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.slug && (
              <span className="text-[10px] text-rose-500 font-bold">{errors.slug.message}</span>
            )}
          </div>
        </div>

        {/* Bloco 2: Tipo, Unidade, Turno e Modalidade */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Categoria / Tipo */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Tipo / Categoria *
            </label>
            <select
              {...register('category')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-semibold"
            >
              <option value="capacitacao">Capacitação Profissional</option>
              <option value="socioeducativo">Oficinas / Socioeducativo</option>
              <option value="comunidade">Comunidade</option>
              <option value="evento">Evento Beneficente</option>
            </select>
          </div>

          {/* Unidade */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Unidade Física *
            </label>
            <select
              {...register('locationName')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-semibold"
            >
              <option value="Sede Lapa">Sede Lapa</option>
              <option value="Cozinha-Escola Doce Mensageiro">Cozinha-Escola Doce Mensageiro</option>
              <option value="Casinha Azul Vila Yolanda">Casinha Azul Vila Yolanda</option>
              <option value="Praça da Cidadania Osasco">Praça da Cidadania Osasco</option>
              <option value="Núcleo Zen Raiz">Núcleo Zen Raiz</option>
              <option value="Mensageiros Cast">Mensageiros Cast</option>
              <option value="Online">Online / Remoto</option>
            </select>
          </div>

          {/* Turno */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Turno *
            </label>
            <select
              {...register('shift')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-semibold"
            >
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
              <option value="sabado">Sábado / Fim de Semana</option>
            </select>
          </div>

          {/* Modalidade */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Modalidade *
            </label>
            <select
              {...register('modality')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-semibold"
            >
              <option value="presencial">Presencial</option>
              <option value="online">Online / Remoto</option>
            </select>
          </div>
        </div>

        {/* Bloco 3: Status, Carga Horária e Previsão de Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Status de Inscrições *
            </label>
            <select
              {...register('statusText')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-semibold"
            >
              <option value="inscricoes-abertas">Inscrições Abertas</option>
              <option value="lista-espera">Lista de Espera</option>
              <option value="encerrado">Encerradas</option>
            </select>
          </div>

          {/* Carga Horária */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Carga Horária (Horas) *
            </label>
            <input
              type="number"
              {...register('workloadVal')}
              placeholder="Ex: 40"
              className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all ${
                errors.workloadVal ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.workloadVal && (
              <span className="text-[10px] text-rose-550 font-bold">{errors.workloadVal.message}</span>
            )}
          </div>

          {/* Previsão de Início */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Previsão de Data / Período *
            </label>
            <input
              type="text"
              {...register('date')}
              placeholder="Ex: Início: Março 2026"
              className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all ${
                errors.date ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.date && (
              <span className="text-[10px] text-rose-500 font-bold">{errors.date.message}</span>
            )}
          </div>
        </div>

        {/* Bloco 4: Capa & Link Externo */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Imagem de Capa */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                URL da Imagem de Capa (Unsplash ou Foto Interna da OSC) *
              </label>
              <input
                type="text"
                {...register('imageUrl')}
                placeholder="Ex: /images/content/oficina-artesanato.jpg ou https://images.unsplash.com/..."
                className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-mono text-xs ${
                  errors.imageUrl ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.imageUrl && (
                <span className="text-[10px] text-rose-500 font-bold">{errors.imageUrl.message}</span>
              )}
            </div>

            {/* Formulário Externo */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-1">
                <Link2 className="h-3.5 w-3.5" /> URL do Formulário Externo (Google Forms / Opcional)
              </label>
              <input
                type="text"
                {...register('registrationLink')}
                placeholder="https://docs.google.com/forms/..."
                className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all ${
                  errors.registrationLink ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.registrationLink && (
                <span className="text-[10px] text-rose-500 font-bold">{errors.registrationLink.message}</span>
              )}
            </div>
          </div>

          {/* Seletor Rápido de Fotos da OSC */}
          <div className="space-y-2 pt-1 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Galeria de Fotos da OSC (Clique para preencher a capa):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {oscPhotos.map((photo) => (
                <button
                  key={photo.url}
                  type="button"
                  onClick={() => setValue('imageUrl', photo.url, { shouldValidate: true })}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    currentImageUrl === photo.url
                      ? 'bg-primary text-white border-primary shadow-sm font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
                  }`}
                >
                  {photo.label}
                </button>
              ))}
            </div>

            {/* Live Preview da Imagem */}
            {currentImageUrl && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative h-24 w-40 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentImageUrl}
                    alt="Prévia da Capa"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://placehold.co/600x400/fee2e2/991b1b?text=Link+Invalido+ou+Incompleto';
                    }}
                  />
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <p className="font-bold text-slate-800">Prévia da Foto de Capa</p>
                  <p className="text-[11px] text-slate-500">
                    Se a imagem não aparecer ou mostrar aviso vermelho, o link colado está incompleto. Use os botões acima para selecionar fotos oficiais da OSC.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bloco 5: Descrição do Curso */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            Descrição do Curso / Evento *
          </label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Forneça uma descrição detalhada abordando os objetivos pedagógicos e públicos norteados do curso..."
            className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-none ${
              errors.description ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
            }`}
          />
          {errors.description && (
            <span className="text-[10px] text-rose-550 font-bold">{errors.description.message}</span>
          )}
        </div>

        {/* Bloco 6: Conteúdo Programático */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
            Conteúdo Programático (Syllabus) *
          </label>
          <p className="text-[10px] text-slate-400">
            Digite um tópico ou módulo por linha. Cada linha gerará um item formatado com check na tela de detalhes pública.
          </p>
          <textarea
            {...register('syllabusText')}
            rows={5}
            placeholder="Módulo 1: Boas Práticas e Higiene Alimentar&#10;Módulo 2: Massas e Técnicas Básicas&#10;Módulo 3: Recheios e Coberturas Gourmet"
            className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-mono text-xs leading-relaxed resize-none ${
              errors.syllabusText ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
            }`}
          />
          {errors.syllabusText && (
            <span className="text-[10px] text-rose-500 font-bold">{errors.syllabusText.message}</span>
          )}
        </div>

        {/* Botão Salvar */}
        <div className="pt-2 flex gap-3 justify-end border-t border-slate-100">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => router.push('/admin/agenda')}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all focus:outline-none"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-orange px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-orange/20 hover:bg-brand-orange-dark active:scale-[0.98] transition-all focus:outline-none disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Salvando Oportunidade...
              </>
            ) : (
              <>
                Salvar Informações
                <Save className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
