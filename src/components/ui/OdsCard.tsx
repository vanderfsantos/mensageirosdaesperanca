import React from 'react';

interface OdsCardProps {
  number: number;
  title: string;
  description: string;
}

export default function OdsCard({ number, title, description }: OdsCardProps) {
  // Mapeamento das cores oficiais das ODS (Hexadecimais originais da ONU)
  const odsColors: Record<number, string> = {
    1: '#E5243B',  // Erradicação da Pobreza (Vermelho)
    3: '#4C9F38',  // Saúde e Bem-Estar (Verde)
    4: '#C5192D',  // Educação de Qualidade (Vermelho Escuro)
    5: '#FF3A21',  // Igualdade de Gênero (Laranja)
    8: '#A21942',  // Trabalho Decente (Bordô)
    10: '#DD1367', // Redução das Desigualdades (Magenta)
    16: '#00689D', // Paz, Justiça e Instituições Eficazes (Azul Médio)
    17: '#19486A', // Parcerias e Meios de Implementação (Azul Escuro)
    18: '#7A5C3E', // Igualdade Racial - ODS 18 Brasil (Marrom/Bronze)
  };

  const backgroundColor = odsColors[number] || '#007F7A';

  return (
    <div className="group flex gap-4 p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] items-start focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 outline-none">
      {/* Bloco Quadrado do Número da ODS */}
      <div 
        style={{ backgroundColor }}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-white font-black text-2xl shadow-sm group-hover:scale-105 transition-transform duration-300"
      >
        {number}
      </div>
      
      {/* Detalhamento do ODS */}
      <div className="space-y-1">
        <h4 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug group-hover:text-primary transition-colors">
          {title}
        </h4>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
