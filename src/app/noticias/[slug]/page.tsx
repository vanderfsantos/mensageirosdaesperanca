import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { getNewsPostBySlug } from '@/lib/supabaseClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);

  if (!post) {
    return {
      title: 'Artigo Não Encontrado',
      description: 'A notícia solicitada não foi localizada em nosso portal.',
    };
  }

  return {
    title: `${post.title} | Notícias Mensageiros da Esperança`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.imageUrl,
          width: 800,
          height: 600,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function NewsDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      {/* Banner Superior - Contexto */}
      <section className="bg-slate-900 text-white py-12 px-4 border-b border-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-4">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para Notícias
          </Link>
          <div className="space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded bg-primary/20 text-primary-light text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Corpo do Artigo */}
      <section className="py-16 px-4 max-w-4xl mx-auto w-full sm:px-6 flex-grow">
        <article className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-10 space-y-8">
          
          {/* Metadados e Informações do Autor */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5 border-l border-slate-200 pl-6">
                <User className="h-4 w-4 text-primary shrink-0" />
                {post.author}
              </span>
              {post.readTime && (
                <span className="flex items-center gap-1.5 border-l border-slate-200 pl-6">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  {post.readTime}
                </span>
              )}
            </div>

            {/* Compartilhamento Rápido */}
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <Share2 className="h-3.5 w-3.5" /> Compartilhar:
              </span>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 rounded-full bg-slate-100 hover:bg-primary hover:text-white flex items-center justify-center text-slate-500 transition-colors"
                title="Compartilhar no Facebook"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a 
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 rounded-full bg-slate-100 hover:bg-primary hover:text-white flex items-center justify-center text-slate-500 transition-colors"
                title="Compartilhar no LinkedIn"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Imagem Principal do Post */}
          <div className="relative h-64 sm:h-96 w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Texto Completo */}
          <div className="prose prose-slate max-w-none text-slate-600 text-sm sm:text-base leading-relaxed space-y-6">
            <p className="font-medium text-slate-800 text-base sm:text-lg leading-relaxed">
              {post.excerpt}
            </p>
            <div className="h-0.5 w-12 bg-primary rounded-full my-6" />
            <p>
              {post.content}
            </p>
          </div>

        </article>
      </section>
    </div>
  );
}
