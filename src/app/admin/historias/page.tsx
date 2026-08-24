import { impactStories } from '@/lib/mock-data';
import HistoriasCrudList from '@/components/admin/HistoriasCrudList';
import { Heart } from 'lucide-react';

export const metadata = { title: 'Histórias de Transformação | Admin — Mensageiros da Esperança' };

export default function AdminHistoriasPage() {
  const stories = [...impactStories].sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/10">
          <Heart className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Histórias de Transformação</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {stories.length} {stories.length === 1 ? 'história cadastrada' : 'histórias cadastradas'} •{' '}
            {stories.filter((s) => s.lgpdConsent).length} com LGPD autorizado
          </p>
        </div>
      </div>
      <HistoriasCrudList initialStories={stories} />
    </div>
  );
}
