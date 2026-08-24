import { getTeamMembers } from '@/lib/supabaseClient';
import EquipeAdmin from '@/components/admin/EquipeAdmin';
import { Users } from 'lucide-react';

export const metadata = { title: 'Equipe e Governança | Admin — Mensageiros da Esperança' };

export default async function AdminEquipePage() {
  const team = await getTeamMembers();
  const members = [...team].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-teal-light text-brand-teal border border-brand-teal/20">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Equipe e Governança</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {members.length} {members.length === 1 ? 'membro cadastrado' : 'membros cadastrados'} na diretoria, conselhos e coordenações
          </p>
        </div>
      </div>
      <EquipeAdmin initialMembers={members} />
    </div>
  );
}
