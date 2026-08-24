'use client';

import React from 'react';
import Image from 'next/image';

export type LogoVariant = 'default' | 'footer' | 'icon-only';

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
}

export default function Logo({
  variant = 'default',
  className = '',
  priority = false,
}: LogoProps) {
  if (variant === 'icon-only') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <div className="relative h-11 w-11 overflow-hidden rounded-full bg-brand-teal-light p-1 border border-brand-teal/20 shadow-sm">
          <Image
            src="/images/logo-mensageiros.png"
            alt="OSC Mensageiros da Esperança - Desde 1998"
            width={48}
            height={48}
            priority={priority}
            className="h-full w-full object-contain scale-[1.95] object-left"
          />
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="relative h-16 sm:h-20 w-64 sm:w-80">
          <Image
            src="/images/logo-mensageiros.png"
            alt="OSC Mensageiros da Esperança - Desde 1998"
            width={320}
            height={80}
            priority={priority}
            className="h-full w-auto object-contain brightness-125 filter drop-shadow"
          />
        </div>
      </div>
    );
  }

  // Default: logo completo colorido ampliado (~260px - 300px)
  return (
    <div className={`relative inline-flex items-center h-14 sm:h-16 w-60 sm:w-72 ${className}`}>
      <Image
        src="/images/logo-mensageiros.png"
        alt="OSC Mensageiros da Esperança - Desde 1998"
        width={300}
        height={72}
        priority={priority}
        className="h-full w-auto object-contain max-h-full"
      />
    </div>
  );
}
