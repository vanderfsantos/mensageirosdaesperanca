'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function WhatsAppFloatingButton() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }
  const phoneNumber = '5511959907614';
  const message = encodeURIComponent('Olá! Gostaria de saber mais sobre o trabalho da OSC Mensageiros da Esperança e como posso ajudar.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Label deslizante no hover */}
      <span className="mr-3 bg-white text-slate-800 font-medium text-sm py-1.5 px-3 rounded-full shadow-lg border border-slate-100 opacity-0 transform translate-x-4 transition-all duration-300 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">
        Fale Conosco!
      </span>

      {/* Botão flutuante principal */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco pelo WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba5a] hover:scale-110 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      >
        {/* Animação de pulso infinito por trás do botão */}
        <span className="absolute -z-10 h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75"></span>

        {/* Logo do WhatsApp em SVG */}
        <svg
          className="h-7 w-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.597-1.012-5.04-2.85-6.88A9.772 9.772 0 0 0 12.008 1.24c-5.442 0-9.87 4.372-9.872 9.732-.001 1.777.472 3.51 1.371 5.054L2.535 21.53l5.59-1.457c1.478.81 2.993 1.238 4.502 1.238zm11.567-5.64c-.29-.145-1.716-.848-1.98-.942-.262-.096-.453-.145-.642.14-.19.285-.735.94-.9 1.127-.166.188-.333.21-.623.065-.29-.147-1.223-.45-2.33-1.437-.862-.77-1.443-1.72-1.61-2.011-.167-.29-.018-.447.127-.59.13-.13.29-.34.435-.508.145-.17.193-.29.29-.485.097-.193.048-.363-.024-.508-.073-.146-.642-1.548-.88-2.12-.23-.556-.464-.48-.642-.486-.165-.007-.354-.009-.543-.009-.19 0-.498.07-.76.363-.262.29-1.002.977-1.002 2.384 0 1.407 1.025 2.766 1.168 2.96.143.19 2.017 3.08 4.886 4.32 1.146.496 2.036.8 2.72.99.7.22 1.334.19 1.838.115.56-.083 1.716-.7 1.96-1.375.24-.674.24-1.25.17-1.375-.074-.12-.263-.193-.553-.34z" />
        </svg>
      </a>
    </div>
  );
}
