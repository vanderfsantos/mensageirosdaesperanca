import { createClient } from '@/lib/supabase/server';
import { adminProfiles } from '@/lib/mock-data';
import UsuariosAdmin from '@/components/admin/UsuariosAdmin';
import { UserCheck } from 'lucide-react';
import { AdminProfile } from '@/types';

export const metadata = {
  title: 'Gestão de Usuários & Aprovações | Admin — Mensageiros da Esperança',
  description: 'Gerenciamento de operadores, análise de solicitações pendentes e permissões de acesso ao painel.',
};

export const dynamic = 'force-dynamic';

export default async function AdminUsuariosPage() {
  let users: AdminProfile[] = [];
  let currentUserRole: 'admin' | 'editor' | 'comunicacao' = 'admin';

  try {
    const supabase = await createClient();
    
    // Obtém o usuário logado para checar permissão de admin
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (currentProfile?.role) {
        currentUserRole = currentProfile.role;
      }
    }

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
        cargo: item.cargo || 'Administrador',
        role: item.role || 'editor',
        status: item.status || 'pending',
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

  const totalAtivos = users.filter((u) => u.status === 'active' || u.status === 'ativo').length;
  const totalPendentes = users.filter((u) => u.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
          <UserCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Usuários & Aprovações de Acesso
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {users.length} {users.length === 1 ? 'operador registrado' : 'operadores registrados'} •{' '}
            <span className="text-emerald-600 font-semibold">{totalAtivos} ativos</span>
            {totalPendentes > 0 && (
              <>
                {' '}• <span className="text-amber-600 font-bold">{totalPendentes} pendentes de aprovação</span>
              </>
            )}
          </p>
        </div>
      </div>
      <UsuariosAdmin initialUsers={users} currentUserRole={currentUserRole} />
    </div>
  );
}
