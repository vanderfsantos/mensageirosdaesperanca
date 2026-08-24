'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Heart, 
  ChevronDown, 
  Users, 
  Building2, 
  Layers, 
  Sparkles,
  MapPin,
  Flame,
  FileText,
  Calendar,
  Newspaper,
  Phone
} from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Não renderiza o Header no painel administrativo
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleMouseEnter = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  const institutionalLinks = [
    { 
      label: 'Quem Somos', 
      href: '/quem-somos', 
      desc: 'Nossa história de 28 anos, missão e governança ética',
      icon: Users 
    },
    { 
      label: 'O Que Fazemos', 
      href: '/o-que-fazemos', 
      desc: 'Eixos de atuação, projetos e metodologia socioassistencial',
      icon: Layers 
    },
    { 
      label: 'Unidades de Atendimento', 
      href: '/quem-somos#unidades', 
      desc: 'Polos em São Paulo, Osasco e Santana de Parnaíba',
      icon: MapPin 
    },
  ];

  const mainNavLinks = [
    { label: 'Início', href: '/' },
    { label: 'Agenda & Cursos', href: '/agenda' },
    { label: 'Negócios Sociais', href: '/negocios-sociais' },
    { label: 'Transparência', href: '/transparencia' },
    { label: 'Notícias', href: '/noticias' },
    { label: 'Contato', href: '/contato' },
  ];

  const isInstitutionalActive = 
    pathname === '/quem-somos' || 
    pathname === '/o-que-fazemos' || 
    pathname === '/impacto' || 
    pathname === '/historias';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo Oficial */}
          <Link href="/" className="flex items-center shrink-0 focus:outline-none" title="Página Inicial">
            <Logo variant="default" priority />
          </Link>

          {/* Navegação Desktop Desobstruída */}
          <nav className="hidden lg:flex items-center gap-4 lg:gap-5 xl:gap-6">
            
            {/* 1. Início */}
            <Link
              href="/"
              className={`text-sm font-medium transition-colors whitespace-nowrap focus:outline-none ${
                pathname === '/'
                  ? 'text-brand-teal font-bold'
                  : 'text-slate-700 hover:text-brand-teal'
              }`}
            >
              Início
            </Link>

            {/* 2. Institucional (Dropdown com Hover Suave) */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap focus:outline-none cursor-pointer py-2 ${
                  isInstitutionalActive || isDropdownOpen
                    ? 'text-brand-teal font-bold'
                    : 'text-slate-700 hover:text-brand-teal'
                }`}
                aria-expanded={isDropdownOpen}
              >
                <span>Institucional</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-brand-teal' : 'text-slate-400'}`} />
              </button>

              {/* Menu Flutuante do Dropdown */}
              {isDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-72 bg-white rounded-2xl border border-slate-200/90 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  role="menu"
                >
                  <div className="space-y-1">
                    {institutionalLinks.map((item) => {
                      const Icon = item.icon;
                      const isItemActive = pathname === item.href.split('#')[0];
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                            isItemActive
                              ? 'bg-brand-teal-light text-brand-teal'
                              : 'hover:bg-slate-50 text-slate-700 hover:text-brand-teal'
                          }`}
                          role="menuitem"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-teal-light text-brand-teal shrink-0 mt-0.5">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold whitespace-nowrap">{item.label}</div>
                            <div className="text-[11px] text-slate-500 font-normal leading-tight">{item.desc}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Agenda & Cursos */}
            <Link
              href="/agenda"
              className={`text-sm font-medium transition-colors whitespace-nowrap focus:outline-none ${
                pathname?.startsWith('/agenda')
                  ? 'text-brand-teal font-bold'
                  : 'text-slate-700 hover:text-brand-teal'
              }`}
            >
              Agenda & Cursos
            </Link>

            {/* 4. Negócios Sociais */}
            <Link
              href="/negocios-sociais"
              className={`text-sm font-medium transition-colors whitespace-nowrap focus:outline-none ${
                pathname === '/negocios-sociais'
                  ? 'text-brand-teal font-bold'
                  : 'text-slate-700 hover:text-brand-teal'
              }`}
            >
              Negócios Sociais
            </Link>

            {/* 5. Transparência */}
            <Link
              href="/transparencia"
              className={`text-sm font-medium transition-colors whitespace-nowrap focus:outline-none ${
                pathname === '/transparencia'
                  ? 'text-brand-teal font-bold'
                  : 'text-slate-700 hover:text-brand-teal'
              }`}
            >
              Transparência
            </Link>

            {/* 6. Notícias */}
            <Link
              href="/noticias"
              className={`text-sm font-medium transition-colors whitespace-nowrap focus:outline-none ${
                pathname?.startsWith('/noticias')
                  ? 'text-brand-teal font-bold'
                  : 'text-slate-700 hover:text-brand-teal'
              }`}
            >
              Notícias
            </Link>

            {/* 7. Contato */}
            <Link
              href="/contato"
              className={`text-sm font-medium transition-colors whitespace-nowrap focus:outline-none ${
                pathname === '/contato'
                  ? 'text-brand-teal font-bold'
                  : 'text-slate-700 hover:text-brand-teal'
              }`}
            >
              Contato
            </Link>
          </nav>

          {/* CTA Principal Desktop: Apenas DOE AGORA */}
          <div className="hidden lg:flex items-center shrink-0">
            <Link
              href="/faca-parte"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-orange hover:bg-brand-orange-dark px-5 py-2.5 text-sm font-bold text-white shadow shadow-brand-orange/25 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 whitespace-nowrap"
            >
              <Heart className="h-4 w-4 fill-white" />
              DOE AGORA
            </Link>
          </div>

          {/* Botão Menu Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/faca-parte"
              className="inline-flex items-center justify-center rounded-full bg-brand-orange px-3.5 py-1.5 text-xs font-bold text-white shadow-sm"
            >
              Doar
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-xl min-h-[44px] min-w-[44px] p-2.5 text-brand-teal hover:bg-brand-teal-light focus:outline-none focus:ring-2 focus:ring-brand-teal cursor-pointer"
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

      {/* Drawer / Menu Mobile */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[640px] border-t border-slate-200 bg-white shadow-lg' : 'max-h-0'
        }`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-4 pb-6 pt-4">
          
          {/* Botão QUERO PARTICIPAR no Topo Mobile */}
          <div className="mb-3">
            <Link
              href="/faca-parte"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-teal-light px-4 py-3 text-sm font-bold text-brand-teal hover:bg-brand-teal-light/80 transition-all text-center border border-brand-teal/20"
            >
              <Users className="h-4 w-4" />
              QUERO PARTICIPAR
            </Link>
          </div>

          {/* Links Principais */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
              pathname === '/'
                ? 'bg-brand-teal-light text-brand-teal'
                : 'text-slate-700 hover:bg-slate-50 hover:text-brand-teal'
            }`}
          >
            Início
          </Link>

          {/* Seção Institucional no Mobile */}
          <div className="pt-2 pb-1 border-t border-slate-100">
            <div className="px-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Institucional
            </div>
            {institutionalLinks.map((item) => {
              const isItemActive = pathname === item.href.split('#')[0];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                    isItemActive
                      ? 'bg-brand-teal-light text-brand-teal'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-brand-teal'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <Link
              href="/agenda"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
                pathname?.startsWith('/agenda')
                  ? 'bg-brand-teal-light text-brand-teal'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-brand-teal'
              }`}
            >
              Agenda & Cursos
            </Link>

            <Link
              href="/negocios-sociais"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
                pathname === '/negocios-sociais'
                  ? 'bg-brand-teal-light text-brand-teal'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-brand-teal'
              }`}
            >
              Negócios Sociais
            </Link>

            <Link
              href="/transparencia"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
                pathname === '/transparencia'
                  ? 'bg-brand-teal-light text-brand-teal'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-brand-teal'
              }`}
            >
              Transparência
            </Link>

            <Link
              href="/noticias"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
                pathname?.startsWith('/noticias')
                  ? 'bg-brand-teal-light text-brand-teal'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-brand-teal'
              }`}
            >
              Notícias
            </Link>

            <Link
              href="/contato"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
                pathname === '/contato'
                  ? 'bg-brand-teal-light text-brand-teal'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-brand-teal'
              }`}
            >
              Contato
            </Link>
          </div>

          {/* CTA DOE AGORA no Rodapé Mobile */}
          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/faca-parte"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange hover:bg-brand-orange-dark px-4 py-3 text-sm font-black uppercase tracking-wider text-white shadow-md shadow-brand-orange/20 transition-all text-center"
            >
              <Heart className="h-4 w-4 fill-white" />
              DOE AGORA
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
