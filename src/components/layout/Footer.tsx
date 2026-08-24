'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const footerLinks = {
    institucional: {
      title: 'Institucional',
      links: [
        { label: 'Quem Somos', href: '/quem-somos' },
        { label: 'Nossa Equipe', href: '/quem-somos#equipe' },
        { label: 'O Que Fazemos', href: '/o-que-fazemos' },
        { label: 'Histórias de Impacto', href: '/historias' },
      ],
    },
    atuacao: {
      title: 'Programas & Ações',
      links: [
        { label: 'Agenda de Cursos', href: '/agenda' },
        { label: 'Inclusão Produtiva', href: '/o-que-fazemos#cursos' },
        { label: 'Negócios Sociais & Buffet', href: '/negocios-sociais' },
        { label: 'Notícias & Blog', href: '/noticias' },
      ],
    },
    participe: {
      title: 'Mobilização',
      links: [
        { label: 'Seja Voluntário', href: '/faca-parte#voluntario' },
        { label: 'Faça uma Doação PIX', href: '/faca-parte#doacoes' },
        { label: 'Empresas & ESG', href: '/faca-parte#empresas' },
        { label: 'Portal da Transparência', href: '/transparencia' },
      ],
    },
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Seção Principal do Rodapé */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Coluna 1: Logo Oficial e Resumo Institucional */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block focus:outline-none">
              <Logo variant="footer" />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              OSC Mensageiros da Esperança — Educação, inclusão produtiva e desenvolvimento econômico e psicossocial desde 1998.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/20 text-brand-teal-light text-[11px] font-bold">
                CNPJ: 02.948.125/0001-08 • OSC Sem Fins Lucrativos
              </span>
            </div>
          </div>

          {/* Coluna 2: Institucional */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-black tracking-widest text-white uppercase mb-4 text-brand-teal-light">
              {footerLinks.institucional.title}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.institucional.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-400 hover:text-brand-teal-light hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Programas & Ações */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-black tracking-widest text-white uppercase mb-4 text-brand-teal-light">
              {footerLinks.atuacao.title}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.atuacao.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-400 hover:text-brand-teal-light hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4: Mobilização & Contato */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-black tracking-widest text-white uppercase mb-4 text-brand-orange">
              Sede e Atendimento
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                <span className="text-xs text-slate-400">
                  Rua Guaicurus, 1000 - Lapa, São Paulo - SP
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-orange shrink-0" />
                <a
                  href="https://wa.me/5511959907614"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  (11) 95990-7614
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand-orange shrink-0" />
                <a
                  href="mailto:contato@mensageirosdaesperanca.org"
                  className="text-xs text-slate-400 hover:text-white transition-colors break-all"
                >
                  contato@mensageirosdaesperanca.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Lema e Redes Sociais */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md text-center md:text-left flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-teal/20 text-brand-teal shrink-0">
              <Heart className="h-4 w-4 fill-brand-teal" />
            </span>
            <p className="text-xs italic text-slate-300">
              &ldquo;Você não faz parte do problema, mas pode fazer parte da solução!&rdquo;
            </p>
          </div>

          {/* Redes Sociais */}
          <div className="flex gap-3">
            {/* Instagram Oficial */}
            <a
              href="https://www.instagram.com/mensageirosdaesperancaong/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-brand-teal hover:text-white transition-all focus:outline-none"
              aria-label="Siga a OSC Mensageiros da Esperança no Instagram"
              title="Instagram Oficial"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>

            {/* Canal do YouTube Oficial */}
            <a
              href="https://www.youtube.com/channel/UCE7ibzT_EoUGqw8JKAIC1XQ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-brand-orange hover:text-white transition-all focus:outline-none"
              aria-label="Inscreva-se no canal do YouTube da OSC Mensageiros da Esperança"
              title="Canal do YouTube Oficial"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Direitos Autorais */}
      <div className="bg-slate-950 py-5 text-center text-xs text-slate-500 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {currentYear} OSC Mensageiros da Esperança. Todos os direitos reservados.</p>
          <p>
            Parceria institucional:{' '}
            <span className="text-slate-400 font-medium">Instituto Inovação Sustentável</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
