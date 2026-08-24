import { adminProfiles } from '@/lib/mock-data';
import UsuariosAdmin from '@/components/admin/UsuariosAdmin';
import { UserCheck } from 'lucide-react';

export const metadata = {
  title: 'Usuários e Acessos | Admin — Mensageiros da Esperança',
  description: 'Gerenciamento de administradores e permissões de acesso ao painel.',
};

export default function AdminUsuariosPage() {
  const users = [...adminProfiles];

  const totalAtivos = users.filter((u) => u.status === 'ativo').length;
  const totalAdmins = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
          <UserCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Usuários e Acessos
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {users.length} administradores cadastrados •{' '}
            <span className="text-emerald-600 font-semibold">{totalAtivos} ativos</span> •{' '}
            <span className="text-purple-600 font-semibold">{totalAdmins} administradores gerais</span>
          </p>
        </div>
      </div>
      <UsuariosAdmin initialUsers={users} />
    </div>
  );
}
