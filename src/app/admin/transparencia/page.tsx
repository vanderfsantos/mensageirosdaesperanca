import { transparencyDocs } from '@/lib/mock-data';
import TransparenciaAdmin from '@/components/admin/TransparenciaAdmin';
import { Shield } from 'lucide-react';

export const metadata = { title: 'Portal de Transparência | Admin — Mensageiros da Esperança' };

export default function AdminTransparenciaPage() {
  const docs = [...transparencyDocs].sort((a, b) => b.year - a.year);

  const totalDisponivel = docs.filter((d) => d.status === 'disponivel').length;
  const totalAtualizacao = docs.filter((d) => d.status === 'atualizacao').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Portal de Transparência</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {docs.length} documentos cadastrados •{' '}
            <span className="text-emerald-600 font-semibold">{totalDisponivel} disponíveis</span>
            {totalAtualizacao > 0 && <> • <span className="text-amber-600 font-semibold">{totalAtualizacao} em atualização</span></>}
          </p>
        </div>
      </div>
      <TransparenciaAdmin initialDocs={docs} />
    </div>
  );
}
