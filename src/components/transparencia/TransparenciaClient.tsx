'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  ExternalLink, 
  FileCheck2, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { TransparencyDoc } from '@/types';

type CategoryKey = TransparencyDoc['category'];

interface TransparenciaClientProps {
  initialDocs: TransparencyDoc[];
}

export default function TransparenciaClient({ initialDocs }: TransparenciaClientProps) {
  const [activeTab, setActiveTab] = useState<CategoryKey>('institucional');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const categories: Record<CategoryKey, { label: string; desc: string }> = {
    institucional: { 
      label: 'Institucional', 
      desc: 'Documentos constitutivos da OSC, certidões e CNPJ.' 
    },
    governanca: { 
      label: 'Governança', 
      desc: 'Atas de eleição, regimento interno e composição diretiva.' 
    },
    atividades: { 
      label: 'Relatórios de Atividades', 
      desc: 'Sumário anual das realizações e impactos nas comunidades.' 
    },
    contas: { 
      label: 'Prestação de Contas', 
      desc: 'Balanços patrimoniais, DREs e pareceres de auditorias.' 
    },
    mrosc: { 
      label: 'Parcerias Públicas (MROSC)', 
      desc: 'Termos de fomento e parcerias MROSC governamentais firmadas.' 
    },
    politicas: { 
      label: 'Políticas Institucionais', 
      desc: 'Códigos de conduta, diretrizes éticas e políticas de privacidade.' 
    },
  };

  const availableYears = useMemo(() => {
    const years = initialDocs.map(doc => doc.year.toString());
    return ['all', ...Array.from(new Set(years))].sort((a, b) => b.localeCompare(a));
  }, [initialDocs]);

  // Utilitário para formatar a URL do Google Drive para modo visualizador (/preview)
  const formatDrivePreviewUrl = (url: string): string => {
    if (!url) return '#';
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
      const docIdMatch = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
      if (docIdMatch && docIdMatch[1]) {
        return `https://docs.google.com/document/d/${docIdMatch[1]}/preview`;
      }
    }
    return url;
  };

  const filteredDocs = useMemo(() => {
    return initialDocs.filter((doc) => {
      const matchCategory = doc.category === activeTab;
      const matchYear = selectedYear === 'all' || doc.year.toString() === selectedYear;
      return matchCategory && matchYear;
    });
  }, [initialDocs, activeTab, selectedYear]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Navegação de Abas Lateral */}
      <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
          <Layers className="h-4.5 w-4.5 text-primary" /> Categorias
        </h3>

        <div className="flex flex-col gap-1.5">
          {(Object.keys(categories) as CategoryKey[]).map((key) => {
            const isSelected = activeTab === key;
            const count = initialDocs.filter(d => d.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                type="button"
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{categories[key].label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="h-0.5 w-full bg-slate-100" />

        {/* Filtro por Ano */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Ano de Referência
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="all">Todos os Anos</option>
            {availableYears.filter(y => y !== 'all').map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Conteúdo da Categoria Selecionada */}
      <div className="lg:col-span-9 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900">
            {categories[activeTab].label}
          </h2>
          <p className="text-slate-600 text-sm">
            {categories[activeTab].desc}
          </p>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4">
            <div className="h-14 w-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <FileText className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Nenhum documento encontrado</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Não há arquivos cadastrados para este ano ou categoria específica.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => {
              const isAvailable = doc.status === 'disponivel';
              const previewUrl = formatDrivePreviewUrl(doc.fileUrl);

              return (
                <div
                  key={doc.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                      <span className="text-xs font-bold text-primary bg-primary-light px-2.5 py-1 rounded-full whitespace-nowrap">
                        Ano {doc.year}
                      </span>
                      {isAvailable ? (
                        <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1 whitespace-nowrap">
                          <FileCheck2 className="h-3 w-3" /> Disponível
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 whitespace-nowrap">
                          <Sparkles className="h-3 w-3" /> Em Atualização
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-slate-800 text-sm leading-snug">
                      {doc.title}
                    </h4>

                    {doc.publishDate && (
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Publicado em {doc.publishDate}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                      {doc.fileType?.toUpperCase() || 'PDF'} {doc.fileSize ? `• ${doc.fileSize}` : ''}
                    </span>

                    {isAvailable ? (
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:text-brand-orange-dark transition-colors whitespace-nowrap"
                      >
                        Visualizar Documento <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 whitespace-nowrap">
                        Aguardando publicação
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
