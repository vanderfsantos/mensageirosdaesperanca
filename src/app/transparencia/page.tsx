'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  ExternalLink, 
  FileCheck2, 
  Calendar,
  Layers
} from 'lucide-react';
import { transparencyDocs } from '@/lib/mock-data';
import { TransparencyDoc } from '@/types';

type CategoryKey = TransparencyDoc['category'];

export default function TransparenciaPage() {
  const [activeTab, setActiveTab] = useState<CategoryKey>('institucional');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Categorias mapeadas com rótulos amigáveis
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

  // Coleta os anos fiscais disponíveis
  const availableYears = useMemo(() => {
    const years = transparencyDocs.map(doc => doc.year.toString());
    return ['all', ...Array.from(new Set(years))].sort((a, b) => b.localeCompare(a));
  }, []);

  // Utilitário para formatar a URL do Google Drive para modo visualizador (/preview)
  const formatDrivePreviewUrl = (url: string): string => {
    if (url.includes('drive.google.com')) {
      // Tenta extrair o ID do arquivo no padrão /file/d/{ID}/view
      const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
      // Tenta extrair o ID no padrão de Documentos do Google docs.google.com/document/d/{ID}
      const docIdMatch = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
      if (docIdMatch && docIdMatch[1]) {
        return `https://docs.google.com/document/d/${docIdMatch[1]}/preview`;
      }
    }
    return url;
  };

  // Filtragem combinada por categoria e ano
  const filteredDocs = useMemo(() => {
    return transparencyDocs.filter((doc) => {
      const matchCategory = doc.category === activeTab;
      const matchYear = selectedYear === 'all' || doc.year.toString() === selectedYear;
      return matchCategory && matchYear;
    });
  }, [activeTab, selectedYear]);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      {/* Banner Principal */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-white py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight">Portal da Transparência</h1>
          <p className="text-primary-light mt-2 text-lg font-light max-w-xl">
            Acesso público aos nossos documentos contábeis, estatutários e relatórios de atividades para auditoria social.
          </p>
        </div>
      </section>

      {/* Repositório por Abas e Filtros */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full sm:px-6 lg:px-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navegação de Abas Lateral (Desktop) / Dropdown (Mobile) */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-primary" /> Categorias
            </h3>
            
            <div className="h-0.5 w-full bg-slate-100" />

            <nav className="flex flex-col gap-2">
              {(Object.keys(categories) as CategoryKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(key);
                    setSelectedYear('all'); // Reseta o filtro de ano ao trocar de aba
                  }}
                  type="button"
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === key
                      ? 'bg-primary-light text-primary border-l-4 border-primary shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  {categories[key].label}
                </button>
              ))}
            </nav>
          </div>

          {/* Listagem de Arquivos */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Header de Descrição da Categoria e Seletor de Ano */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {categories[activeTab].label}
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm">
                  {categories[activeTab].desc}
                </p>
              </div>

              {/* Filtro de Ano */}
              <div className="flex items-center gap-2 shrink-0">
                <Calendar className="h-4.5 w-4.5 text-slate-400" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Todos os Anos</option>
                  {availableYears.filter(y => y !== 'all').map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid dos Cards de Documentos */}
            {filteredDocs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/85 p-12 text-center space-y-4">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Nenhum documento listado</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  Não localizamos arquivos publicados para esta aba no ano fiscal selecionado.
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
                      className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md hover:border-slate-300/80 transition-all group"
                    >
                      <div className="space-y-3">
                        {/* Status e Ano */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                            Exercício: {doc.year}
                          </span>
                          
                          {isAvailable ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-700 border border-green-150">
                              Disponível
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-150 animate-pulse">
                              Em atualização
                            </span>
                          )}
                        </div>

                        {/* Título do Documento */}
                        <h4 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {doc.title}
                        </h4>
                      </div>

                      {/* Ações e Rodapé do Card */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100/80">
                        <span className="text-xs text-slate-400 font-bold">
                          {doc.fileType} • {doc.fileSize}
                        </span>

                        {isAvailable ? (
                          <a
                            href={previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-black text-primary hover:text-primary-hover uppercase tracking-wider transition-colors"
                          >
                            Visualizar
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs font-bold text-slate-400 cursor-not-allowed">
                            Aguardando Envio
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Aviso sobre Gestão e Apoio do Instituto Inovação Sustentável */}
            <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5.5 w-5.5 text-primary-light" />
                <h4 className="font-extrabold text-sm sm:text-base tracking-wide">
                  Conformidade e Apoio ESG
                </h4>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Toda a gestão de compliance, relacionamento jurídico, contabilidade e auditoria de balanços sociais da **OSC Mensageiros da Esperança** é realizada de forma integrada com a equipe técnica do **Instituto Inovação Sustentável**, visando as melhores práticas do Marco Regulatório do Terceiro Setor (MROSC - Lei nº 13.019/2014).
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
