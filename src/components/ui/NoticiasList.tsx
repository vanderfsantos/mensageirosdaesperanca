'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { NewsPost } from '@/types';

interface NoticiasListProps {
  posts: NewsPost[];
}

export default function NoticiasList({ posts }: NoticiasListProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Coleta as categorias de forma dinâmica
  const categories = useMemo(() => {
    const cats = posts.map(p => p.category);
    return ['all', ...Array.from(new Set(cats))];
  }, [posts]);

  // Filtra as notícias
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return posts;
    return posts.filter(p => p.category === activeCategory);
  }, [posts, activeCategory]);

  return (
    <div className="space-y-10">
      {/* Botões de Filtro */}
      <div className="flex overflow-x-auto gap-2.5 pb-2 border-b border-slate-200 scrollbar-none snap-x">
        <button
          onClick={() => setActiveCategory('all')}
          type="button"
          className={`px-5 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase shrink-0 snap-center transition-all ${
            activeCategory === 'all'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Todas as Notícias
        </button>
        {categories.filter(c => c !== 'all').map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            type="button"
            className={`px-5 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase shrink-0 snap-center transition-all ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Posts */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Nenhum artigo publicado</h3>
          <p className="text-slate-500 text-sm">
            Não localizamos postagens para a categoria selecionada.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article 
              key={post.id}
              className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
            >
              {/* Imagem de Destaque */}
              <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
                <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded bg-primary text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                  {post.category}
                </span>
              </div>

              {/* Informações Textuais */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.date}
                    </span>
                    {post.readTime && (
                      <span className="flex items-center gap-1 border-l border-slate-200 pl-3">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-slate-800 text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Rodapé do Card */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-150/80">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-600 truncate max-w-32">{post.author}</span>
                  </div>

                  <Link
                    href={`/noticias/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-black text-primary hover:text-primary-hover uppercase tracking-wider group-hover:translate-x-0.5 transition-all"
                  >
                    Ler Mais
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
