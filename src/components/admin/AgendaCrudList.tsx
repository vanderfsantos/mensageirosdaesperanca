'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  Loader2,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { CourseEvent } from '@/types';
import { deleteCourseAction, toggleStatusAction } from '@/app/admin/agenda/actions';

interface AgendaCrudListProps {
  initialCourses: CourseEvent[];
}

export default function AgendaCrudList({ initialCourses }: AgendaCrudListProps) {
  const [courses, setCourses] = useState<CourseEvent[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Controle de paginação
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Estados de confirmação de exclusão
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Estados de loading de alteração rápida de status
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filtra os registros
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch = 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' || 
        c.statusText === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [courses, searchTerm, statusFilter]);

  // Paginação
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredCourses, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Exclusão de curso
  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      await deleteCourseAction(deletingId);
      setCourses(prev => prev.filter(c => c.id !== deletingId));
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir o curso.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Alteração de status rápida em linha
  const handleStatusChange = async (id: string, newStatusText: 'inscricoes-abertas' | 'lista-espera' | 'encerrado') => {
    setUpdatingId(id);

    // Mapeamento técnico de statusText -> status
    let technicalStatus: 'upcoming' | 'ongoing' | 'completed' = 'upcoming';
    if (newStatusText === 'encerrado') {
      technicalStatus = 'completed';
    }

    try {
      await toggleStatusAction(id, technicalStatus, newStatusText);
      setCourses(prev => prev.map(c => c.id === id ? { ...c, status: technicalStatus, statusText: newStatusText } : c));
    } catch (err) {
      console.error(err);
      alert('Erro ao alterar status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Topbar: Título & Botão Novo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Agenda de Cursos e Oficinas</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Painel de Controle e Matrículas
          </p>
        </div>

        <Link
          href="/admin/agenda/novo"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-orange px-5 py-3 text-sm font-bold text-white shadow-md shadow-brand-orange/20 hover:bg-brand-orange-dark active:scale-[0.98] transition-all focus:outline-none"
        >
          <Plus className="h-4.5 w-4.5" />
          Novo Curso
        </Link>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
        {/* Campo de Busca */}
        <div className="sm:col-span-8 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Pesquisar por título, unidade ou categoria..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>

        {/* Filtro de Status */}
        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all font-semibold"
          >
            <option value="all">Todos os Status</option>
            <option value="inscricoes-abertas">Inscrições Abertas</option>
            <option value="lista-espera">Lista de Espera</option>
            <option value="encerrado">Encerradas</option>
          </select>
        </div>
      </div>

      {/* Tabela de Listagem */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse text-slate-600 text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-455 uppercase tracking-widest">
                <th className="py-4 px-6">Curso / Oficina</th>
                <th className="py-4 px-6">Unidade</th>
                <th className="py-4 px-6">Modalidade</th>
                <th className="py-4 px-6">Status Rápido</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCourses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Nenhum curso localizado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                paginatedCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Curso / Carga Horária */}
                    <td className="py-4 px-6 space-y-1">
                      <h4 className="font-extrabold text-slate-800 line-clamp-1">{course.title}</h4>
                      <div className="flex items-center gap-4 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-primary" /> {course.date}
                        </span>
                        <span className="flex items-center gap-1 border-l border-slate-200 pl-3">
                          <Clock className="h-3 w-3 text-primary" /> {course.workload}
                        </span>
                      </div>
                    </td>

                    {/* Unidade */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{course.locationName}</span>
                      </div>
                    </td>

                    {/* Modalidade */}
                    <td className="py-4 px-6">
                      <span className="inline-flex px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider">
                        {course.modality}
                      </span>
                    </td>

                    {/* Status Rápido */}
                    <td className="py-4 px-6">
                      {updatingId === course.id ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Atualizando...
                        </div>
                      ) : (
                        <select
                          value={course.statusText}
                          onChange={(e) => handleStatusChange(course.id, e.target.value as 'inscricoes-abertas' | 'lista-espera' | 'encerrado')}
                          className={`rounded-lg border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary font-bold ${
                            course.statusText === 'inscricoes-abertas' ? 'text-primary' :
                            course.statusText === 'lista-espera' ? 'text-amber-600' :
                            'text-slate-400'
                          }`}
                        >
                          <option value="inscricoes-abertas">Inscrições Abertas</option>
                          <option value="lista-espera">Lista de Espera</option>
                          <option value="encerrado">Encerradas</option>
                        </select>
                      )}
                    </td>

                    {/* Ações */}
                    <td className="py-4 px-6 text-right space-x-1.5 shrink-0">
                      <Link
                        href={`/admin/agenda/${course.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors cursor-pointer"
                        title="Editar Curso"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeletingId(course.id)}
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Excluir Curso"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé e Paginação */}
        {totalPages > 1 && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                type="button"
                className="h-8 px-2.5 rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                type="button"
                className="h-8 px-2.5 rounded-lg border border-slate-200 text-slate-500 bg-white hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {deletingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200/80 shadow-xl text-center space-y-4">
            <div className="h-12 w-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-slate-800 text-base">Confirmar Exclusão</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Você tem certeza que deseja excluir esta oportunidade? Esta ação revalidará o cache público e é irreversível.
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setDeletingId(null)}
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all focus:outline-none"
              >
                Cancelar
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDelete}
                type="button"
                className="rounded-xl bg-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/10 hover:bg-rose-600 active:scale-[0.98] transition-all focus:outline-none"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir Oportunidade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
