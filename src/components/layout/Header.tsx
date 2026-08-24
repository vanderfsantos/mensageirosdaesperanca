'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Heart, Users } from 'lucide-react';

export default function Header() {
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
    { label: 'Quem Somos', href: '#quem-somos' },
    { label: 'Nossa Atuação', href: '#atuacao' },
    { label: 'Transparência', href: '#transparencia' },
    { label: 'Notícias', href: '#noticias' },
    { label: 'Contato', href: '#contato' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAFAFA]/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
          : 'bg-[#FAFAFA] border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo da Mensageiros da Esperança */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light transition-transform duration-300 group-hover:scale-105">
              {/* Símbolo de Esperança/Acolhimento */}
              <Heart className="h-6 w-6 text-primary fill-primary/10 transition-colors duration-300 group-hover:fill-primary/20" />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] text-white">
                ★
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase leading-none">
                Mensageiros da
              </span>
              <span className="text-xl font-extrabold tracking-tight text-primary uppercase leading-tight group-hover:text-primary-hover transition-colors">
                Esperança
              </span>
            </div>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-slate-600 transition-colors hover:text-primary focus:outline-none focus:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Ações Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="#participe"
              className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover px-4 py-2 rounded-lg transition-colors focus:outline-none"
            >
              <Users className="h-4 w-4" />
              Quero Participar
            </Link>
            <Link
              href="#doe"
              className="relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-white shadow-md shadow-secondary/20 transition-all hover:bg-secondary-hover hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            >
              DOE AGORA
            </Link>
          </div>

          {/* Botão Menu Mobile */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Abrir menu principal</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6 text-slate-800" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6 text-slate-800" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[450px] border-t border-slate-200' : 'max-h-0'
        }`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-4 pb-6 pt-4 bg-[#FAFAFA] shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-100 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-6 pt-6 border-t border-slate-200/80 flex flex-col gap-3">
            <Link
              href="#participe"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary-light px-4 py-3 text-base font-bold text-primary hover:bg-primary-light/80 transition-all text-center"
            >
              <Users className="h-5 w-5" />
              QUERO PARTICIPAR
            </Link>
            <Link
              href="#doe"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex w-full items-center justify-center rounded-xl bg-secondary px-4 py-3 text-base font-bold text-white shadow-md shadow-secondary/15 hover:bg-secondary-hover transition-all text-center"
            >
              DOE AGORA
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
