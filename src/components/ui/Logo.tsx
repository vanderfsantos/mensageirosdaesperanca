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
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-brand-teal-light p-1 border border-brand-teal/20">
          <Image
            src="/images/logo-mensageiros.png"
            alt="OSC Mensageiros da Esperança - Desde 1998"
            width={40}
            height={40}
            priority={priority}
            className="h-full w-full object-contain scale-[1.9] object-left"
          />
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="relative h-12 w-56">
          <Image
            src="/images/logo-mensageiros.png"
            alt="OSC Mensageiros da Esperança - Desde 1998"
            width={224}
            height={48}
            priority={priority}
            className="h-full w-auto object-contain brightness-110"
          />
        </div>
      </div>
    );
  }

  // Default: logo completo colorido com largura ~220px
  return (
    <div className={`relative inline-block h-12 w-52 sm:w-56 ${className}`}>
      <Image
        src="/images/logo-mensageiros.png"
        alt="OSC Mensageiros da Esperança - Desde 1998"
        width={224}
        height={48}
        priority={priority}
        className="h-full w-auto object-contain"
      />
    </div>
  );
}
