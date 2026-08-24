import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface NegocioSocialCardProps {
  title: string;
  tagline: string;
  description: string;
  imageUrl: string;
  ctaLink: string;
  ctaText?: string;
}

export default function NegocioSocialCard({
  title,
  tagline,
  description,
  imageUrl,
  ctaLink,
  ctaText = 'Solicite um Orçamento',
}: NegocioSocialCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Imagem do Negócio Social com Zoom no Hover */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary text-xs font-bold text-white shadow-sm uppercase tracking-wider">
            {tagline}
          </span>
        </div>
      </div>

      {/* Conteúdo e Botões */}
      <div className="flex flex-1 flex-col p-6 justify-between gap-6">
        <div className="space-y-3">
          <h3 className="text-xl font-extrabold text-slate-800 tracking-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">
            {description}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Link
            href={ctaLink}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm shadow-primary/10 hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none"
          >
            {ctaText}
            <ArrowUpRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
