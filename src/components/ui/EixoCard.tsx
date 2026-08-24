import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EixoCardProps {
  title: string;
  description: string;
  IconComponent: LucideIcon;
}

export default function EixoCard({ title, description, IconComponent }: EixoCardProps) {
  return (
    <div className="group relative bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm transition-all duration-300 hover:border-brand-teal hover:shadow-xl hover:-translate-y-1 overflow-hidden focus-within:ring-2 focus-within:ring-brand-teal focus-within:ring-offset-2 outline-none">
      {/* Detalhe de borda superior em brand-teal */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-teal/20 group-hover:bg-brand-teal transition-all duration-300" />

      <div className="flex flex-col gap-4">
        {/* Container do Ícone */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-teal-light text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all duration-300">
          <IconComponent className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Textos Informativos */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight transition-colors group-hover:text-brand-teal">
            {title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
