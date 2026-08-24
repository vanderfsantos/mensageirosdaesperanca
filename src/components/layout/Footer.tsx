'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = 2026;

  const footerLinks = {
    institucional: {
      title: 'Institucional',
      links: [
        { label: 'Quem Somos', href: '#quem-somos' },
        { label: 'Nossa Equipe', href: '#equipe' },
        { label: 'Nossa História', href: '#historia' },
        { label: 'Prêmios e Editais', href: '#premios' },
      ],
    },
    atuacao: {
      title: 'Nossa Atuação',
      links: [
        { label: 'Cursos Livres', href: '#cursos' },
        { label: 'Projetos Sociais', href: '#projetos' },
        { label: 'Apoio Comunitário', href: '#apoio' },
        { label: 'Eventos Beneficentes', href: '#eventos' },
      ],
    },
    participe: {
      title: 'Participe',
      links: [
        { label: 'Seja Voluntário', href: '#voluntario' },
        { label: 'Faça uma Doação', href: '#doe' },
        { label: 'Parceria Corporativa', href: '#parcerias' },
        { label: 'Apadrinhe uma Criança', href: '#apadrinhamento' },
      ],
    },
    transparencia: {
      title: 'Transparência',
      links: [
        { label: 'Relatórios de Impacto', href: '#transparencia' },
        { label: 'Estatuto e Atas', href: '#estatuto' },
        { label: 'Balanço Financeiro', href: '#balanco' },
        { label: 'Canal de Ouvidoria', href: '#ouvidoria' },
      ],
    },
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Seção Principal do Rodapé */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Coluna 1: Institucional */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-4">
              {footerLinks.institucional.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.institucional.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-primary-light hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 2: Atuação */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-4">
              {footerLinks.atuacao.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.atuacao.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-primary-light hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Participe */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-4">
              {footerLinks.participe.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.participe.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-primary-light hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4: Transparência */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-4">
              {footerLinks.transparencia.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.transparencia.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-primary-light hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 5: Contato */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-4">
              Contato
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-sm text-slate-400">
                  Rua da Solidariedade, 450 - Jd. Esperança, São Paulo - SP, 04855-120
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <a
                  href="https://wa.me/5511959907614"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 hover:text-primary-light transition-colors"
                >
                  (11) 95990-7614
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <a
                  href="mailto:contato@mensageirosdaesperanca.org"
                  className="text-sm text-slate-400 hover:text-primary-light transition-colors break-all"
                >
                  contato@mensageirosdaesperanca.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Lema e Redes Sociais */}
        <div className="mt-16 pt-10 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md text-center md:text-left">
            <span className="inline-flex items-center justify-center p-2 rounded-lg bg-primary/10 text-primary mb-3">
              <Heart className="h-5 w-5 fill-primary/20" />
            </span>
            <p className="text-base italic font-medium text-slate-300">
              &ldquo;Você não faz parte do problema, mas pode fazer parte da solução!&rdquo;
            </p>
          </div>

          {/* Redes Sociais */}
          <div className="flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-primary hover:text-white transition-all focus:outline-none"
              aria-label="Siga-nos no Instagram"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-primary hover:text-white transition-all focus:outline-none"
              aria-label="Siga-nos no Facebook"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-primary hover:text-white transition-all focus:outline-none"
              aria-label="Siga-nos no LinkedIn"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-primary hover:text-white transition-all focus:outline-none"
              aria-label="Assista nosso canal no YouTube"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Direitos Autorais */}
      <div className="bg-slate-950 py-6 text-center text-xs text-slate-500 border-t border-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {currentYear} Mensageiros da Esperança. Todos os direitos reservados.</p>
          <p>
            Parceria institucional:{' '}
            <span className="text-slate-400 font-medium">Instituto Inovação Sustentável</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
