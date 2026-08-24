'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Users } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '/' },
    { label: 'Quem Somos', href: '/quem-somos' },
    { label: 'O Que Fazemos', href: '/o-que-fazemos' },
    { label: 'Agenda & Cursos', href: '/agenda' },
    { label: 'Transparência', href: '/transparencia' },
    { label: 'Notícias', href: '/noticias' },
    { label: 'Faça Parte', href: '/faca-parte' },
    { label: 'Contato', href: '/contato' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-brand-gray-surface shadow-sm'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Oficial da OSC Mensageiros da Esperança */}
          <Link href="/" className="flex items-center focus:outline-none" title="Página Inicial">
            <Logo variant="default" priority />
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors focus:outline-none ${
                    isActive
                      ? 'text-brand-teal font-bold'
                      : 'text-slate-600 hover:text-brand-teal'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Ações Desktop */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/faca-parte"
              className="flex items-center gap-1.5 text-xs font-bold text-brand-teal hover:text-brand-teal-dark px-3 py-2 rounded-xl transition-colors focus:outline-none bg-brand-teal-light/60 hover:bg-brand-teal-light"
            >
              <Users className="h-4 w-4" />
              Quero Participar
            </Link>
            <Link
              href="/faca-parte#doacoes"
              className="relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-brand-orange hover:bg-brand-orange-dark px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-brand-orange/20 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
            >
              DOE AGORA
            </Link>
          </div>

          {/* Botão Menu Mobile */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-brand-teal hover:bg-brand-teal-light focus:outline-none focus:ring-2 focus:ring-brand-teal"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Abrir menu principal</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6 text-brand-teal" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6 text-brand-teal" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[520px] border-t border-slate-200 bg-white' : 'max-h-0'
        }`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-4 pb-6 pt-4 shadow-inner">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-brand-teal-light text-brand-teal'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-brand-teal'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              href="/faca-parte"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-teal-light px-4 py-3 text-sm font-bold text-brand-teal hover:bg-brand-teal-light/80 transition-all text-center"
            >
              <Users className="h-4 w-4" />
              QUERO PARTICIPAR
            </Link>
            <Link
              href="/faca-parte#doacoes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex w-full items-center justify-center rounded-xl bg-brand-orange hover:bg-brand-orange-dark px-4 py-3 text-sm font-black uppercase tracking-wider text-white shadow-md shadow-brand-orange/20 transition-all text-center"
            >
              DOE AGORA
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
