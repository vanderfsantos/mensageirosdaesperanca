import React from 'react';
import Image from 'next/image';
import { MapPin, Navigation, Check } from 'lucide-react';

interface UnidadeCardProps {
  name: string;
  address: string;
  services: string[];
  mapUrl: string;
  description?: string;
  imageUrl?: string;
}

export default function UnidadeCard({
  name,
  address,
  services,
  mapUrl,
  description,
  imageUrl,
}: UnidadeCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/60 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col justify-between focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 outline-none">
      
      {/* Imagem Real da Unidade */}
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Nome e Descrição da Unidade */}
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight transition-colors group-hover:text-primary">
              {name}
            </h3>
            {description && (
              <p className="text-slate-500 text-sm leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Endereço */}
          <div className="flex items-start gap-2.5 text-slate-600 text-sm">
            <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
            <span>{address}</span>
          </div>

          {/* Serviços / Oficinas Oferecidas */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Serviços e Atividades
            </h4>
            <ul className="space-y-2.5">
              {services.map((service, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-light text-primary shrink-0 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Botão Como Chegar */}
        <div className="pt-4 border-t border-slate-100 mt-6">
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary transition-all focus:outline-none"
          >
            <Navigation className="h-4 w-4 text-secondary shrink-0" />
            Ver no Mapa
          </a>
        </div>
      </div>
    </div>
  );
}
