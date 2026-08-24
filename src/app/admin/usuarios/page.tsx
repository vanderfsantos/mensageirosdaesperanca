import { createClient } from '@/lib/supabase/server';
import { adminProfiles } from '@/lib/mock-data';
import UsuariosAdmin from '@/components/admin/UsuariosAdmin';
import { UserCheck } from 'lucide-react';
import { AdminProfile } from '@/types';

export const metadata = {
  title: 'Usuários e Acessos | Admin — Mensageiros da Esperança',
  description: 'Gerenciamento de administradores e permissões de acesso ao painel.',
};

export const dynamic = 'force-dynamic';

export default async function AdminUsuariosPage() {
  let users: AdminProfile[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      users = data.map((item: any) => ({
        id: item.id,
        fullName: item.full_name || 'Administrador',
        email: item.email || '',
        role: item.role || 'editor',
        status: item.status || 'ativo',
        createdAt: item.created_at
          ? new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '')
          : 'Recente',
      }));
    } else {
      users = [...adminProfiles];
    }
  } catch (err) {
    console.warn('AdminUsuariosPage: Falha ao carregar profiles do Supabase:', err);
    users = [...adminProfiles];
  }

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
            {users.length} {users.length === 1 ? 'administrador cadastrado' : 'administradores cadastrados'} •{' '}
            <span className="text-emerald-600 font-semibold">{totalAtivos} ativos</span> •{' '}
            <span className="text-purple-600 font-semibold">{totalAdmins} administradores gerais</span>
          </p>
        </div>
      </div>
      <UsuariosAdmin initialUsers={users} />
    </div>
  );
}
