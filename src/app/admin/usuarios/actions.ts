'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { adminProfiles } from '@/lib/mock-data';
import { AdminProfile } from '@/types';

export type AdminActionResponse = {
  success: boolean;
  error?: string;
  id?: string;
  simulated?: boolean;
};

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Instancia o cliente administrativo do Supabase com Service Role Key */
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Verifica se o usuário atual é administrador geral */
async function verifyIsAdmin(): Promise<{ isAdmin: boolean; error?: string }> {
  if (!hasSupabase()) {
    return { isAdmin: true }; // Em modo simulação local
  }

  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { isAdmin: false, error: 'Sessão expirada. Faça login novamente.' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return { isAdmin: false, error: 'Apenas Administradores Gerais podem gerenciar operadores.' };
    }

    return { isAdmin: true };
  } catch {
    return { isAdmin: true }; // Fallback tolerante
  }
}

/**
 * Atualiza os dados do operador no auth.users e na tabela public.profiles via Service Role Key
 */
export async function updateUserAdmin(
  userId: string,
  data: {
    fullName: string;
    email: string;
    cargo?: string;
    role: string;
    status: string;
    password?: string;
  }
): Promise<AdminActionResponse> {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Em modo simulação local sem Supabase configurado
  if (!hasSupabase()) {
    const idx = adminProfiles.findIndex((u) => u.id === userId || u.email === data.email);
    if (idx > -1) {
      adminProfiles[idx] = {
        ...adminProfiles[idx],
        fullName: data.fullName,
        email: data.email,
        cargo: data.cargo,
        role: data.role as AdminProfile['role'],
        status: data.status as AdminProfile['status'],
      };
    }
    revalidatePath('/admin/usuarios');
    return { success: true, simulated: true, id: userId };
  }

  if (!serviceRoleKey || !supabaseUrl) {
    return {
      success: false,
      error: 'Variável SUPABASE_SERVICE_ROLE_KEY não encontrada no servidor. Configure-a no painel da Vercel.',
    };
  }

  const check = await verifyIsAdmin();
  if (!check.isAdmin) {
    return { success: false, error: check.error || 'Acesso negado.' };
  }

  const supabaseAdmin = createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Atualiza dados no auth.users (E-mail, confirmação e senha)
  const authPayload: {
    email: string;
    email_confirm: boolean;
    password?: string;
    user_metadata?: Record<string, unknown>;
  } = {
    email: data.email.trim(),
    email_confirm: true, // Auto-confirma o novo e-mail sem travar em verificação
    user_metadata: {
      full_name: data.fullName,
      cargo: data.cargo,
      role: data.role,
    },
  };

  if (data.password && data.password.trim().length >= 6) {
    authPayload.password = data.password.trim();
  }

  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    authPayload
  );

  if (authError) {
    console.error('Falha no Supabase Auth:', authError.message);
    return { success: false, error: `Falha no Supabase Auth: ${authError.message}` };
  }

  // 2. Atualiza os dados na tabela public.profiles
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({
      full_name: data.fullName,
      email: data.email.trim(),
      cargo: data.cargo,
      role: data.role,
      status: data.status,
    })
    .eq('id', userId);

  if (profileError) {
    console.error('Falha ao atualizar Profiles:', profileError.message);
    return { success: false, error: `Falha ao atualizar Profiles: ${profileError.message}` };
  }

  // Atualiza cache em memória se existir
  const idx = adminProfiles.findIndex((u) => u.id === userId || u.email === data.email);
  if (idx > -1) {
    adminProfiles[idx] = {
      ...adminProfiles[idx],
      fullName: data.fullName,
      email: data.email.trim(),
      cargo: data.cargo,
      role: data.role as AdminProfile['role'],
      status: data.status as AdminProfile['status'],
    };
  }

  revalidatePath('/admin/usuarios');
  return { success: true, id: userId };
}

/**
 * Define ou altera a senha de um usuário via Service Role Key (Admin Auth API)
 */
export async function updateUserPasswordAdmin(
  userId: string,
  newPassword: string
): Promise<AdminActionResponse> {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!hasSupabase()) {
    return { success: true, simulated: true, id: userId };
  }

  if (!serviceRoleKey || !supabaseUrl) {
    return {
      success: false,
      error: 'Variável SUPABASE_SERVICE_ROLE_KEY não encontrada no servidor. Configure-a no painel da Vercel.',
    };
  }

  if (newPassword.length < 6) {
    return { success: false, error: 'A senha deve ter no mínimo 6 caracteres.' };
  }

  const supabaseAdmin = createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword.trim(),
    });

    if (error) {
      return { success: false, error: `Falha no Supabase Auth: ${error.message}` };
    }

    return { success: true, id: userId };
  } catch (err: unknown) {
    console.error('updateUserPasswordAdmin: Erro inesperado', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Falha ao atualizar a senha do usuário.',
    };
  }
}

/** Aprovar solicitação de novo operador */
export async function approveAdminUserAction(
  id: string,
  role: 'admin' | 'editor' | 'comunicacao' = 'editor'
): Promise<AdminActionResponse> {
  const check = await verifyIsAdmin();
  if (!check.isAdmin) {
    return { success: false, error: check.error || 'Acesso negado.' };
  }

  const idx = adminProfiles.findIndex((u) => u.id === id);
  if (idx > -1) {
    adminProfiles[idx].status = 'active';
    adminProfiles[idx].role = role;
  }

  if (hasSupabase()) {
    try {
      const supabaseAdmin = getSupabaseAdmin();
      if (supabaseAdmin) {
        await supabaseAdmin
          .from('profiles')
          .update({
            status: 'active',
            role,
          })
          .eq('id', id);
      } else {
        const supabase = await createServerSupabase();
        const { error } = await supabase
          .from('profiles')
          .update({
            status: 'active',
            role,
          })
          .eq('id', id);

        if (error) {
          return { success: false, error: error.message };
        }
      }
    } catch (err: unknown) {
      console.warn('approveAdminUserAction erro:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao aprovar.' };
    }
  }

  revalidatePath('/admin/usuarios');
  return { success: true, id };
}

/** Recusar solicitação de operador */
export async function rejectAdminUserAction(
  id: string,
  deletePermanently = false
): Promise<AdminActionResponse> {
  const check = await verifyIsAdmin();
  if (!check.isAdmin) {
    return { success: false, error: check.error || 'Acesso negado.' };
  }

  const idx = adminProfiles.findIndex((u) => u.id === id);
  if (idx > -1) {
    if (deletePermanently) {
      adminProfiles.splice(idx, 1);
    } else {
      adminProfiles[idx].status = 'rejected';
    }
  }

  if (hasSupabase()) {
    try {
      const supabaseAdmin = getSupabaseAdmin();
      if (supabaseAdmin) {
        if (deletePermanently) {
          await supabaseAdmin.from('profiles').delete().eq('id', id);
          await supabaseAdmin.auth.admin.deleteUser(id);
        } else {
          await supabaseAdmin
            .from('profiles')
            .update({ status: 'rejected' })
            .eq('id', id);
        }
      } else {
        const supabase = await createServerSupabase();
        if (deletePermanently) {
          const { error } = await supabase.from('profiles').delete().eq('id', id);
          if (error) return { success: false, error: error.message };
        } else {
          const { error } = await supabase
            .from('profiles')
            .update({ status: 'rejected' })
            .eq('id', id);
          if (error) return { success: false, error: error.message };
        }
      }
    } catch (err: unknown) {
      console.warn('rejectAdminUserAction erro:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao recusar.' };
    }
  }

  revalidatePath('/admin/usuarios');
  return { success: true, id };
}

/** Salvar ou convidar novo usuário administrador */
export async function saveAdminUserAction(data: {
  id?: string;
  fullName: string;
  email: string;
  cargo?: string;
  role: 'admin' | 'editor' | 'comunicacao';
  status: AdminProfile['status'];
  password?: string;
}): Promise<AdminActionResponse> {
  const check = await verifyIsAdmin();
  if (!check.isAdmin) {
    return { success: false, error: check.error || 'Acesso negado.' };
  }

  // Se já possui ID (edição), delega para updateUserAdmin
  if (data.id && data.id.trim() !== '') {
    return await updateUserAdmin(data.id, {
      fullName: data.fullName,
      email: data.email,
      cargo: data.cargo,
      role: data.role,
      status: data.status,
      password: data.password,
    });
  }

  const finalId = `usr-${Date.now()}`;

  const newUser: AdminProfile = {
    id: finalId,
    fullName: data.fullName,
    email: data.email.trim(),
    cargo: data.cargo || 'Administrador',
    role: data.role,
    status: data.status,
    createdAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
  };
  adminProfiles.unshift(newUser);

  if (hasSupabase()) {
    try {
      const supabaseAdmin = getSupabaseAdmin();
      if (supabaseAdmin) {
        // Cria usuário no auth.users via Admin API
        const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
          email: data.email.trim(),
          email_confirm: true,
          password: data.password && data.password.trim().length >= 6 ? data.password.trim() : undefined,
          user_metadata: {
            full_name: data.fullName,
            cargo: data.cargo,
            role: data.role,
          },
        });

        if (authErr) {
          return { success: false, error: `Falha no Supabase Auth: ${authErr.message}` };
        }

        const createdId = authData?.user?.id || finalId;

        const { error: profileErr } = await supabaseAdmin.from('profiles').upsert({
          id: createdId,
          full_name: data.fullName,
          email: data.email.trim(),
          cargo: data.cargo || 'Administrador',
          role: data.role,
          status: data.status,
        });

        if (profileErr) {
          return { success: false, error: `Falha ao salvar Profile: ${profileErr.message}` };
        }

        revalidatePath('/admin/usuarios');
        return { success: true, id: createdId };
      } else {
        const supabase = await createServerSupabase();
        const { error } = await supabase.from('profiles').insert({
          id: finalId,
          full_name: data.fullName,
          email: data.email.trim(),
          cargo: data.cargo || 'Administrador',
          role: data.role,
          status: data.status,
        });

        if (error) {
          return { success: false, error: error.message };
        }
      }
    } catch (err: unknown) {
      console.warn('saveAdminUserAction: Erro no Supabase:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao criar usuário.' };
    }
  }

  revalidatePath('/admin/usuarios');
  return { success: true, id: finalId };
}

/** Alterar status do usuário */
export async function toggleAdminUserStatusAction(
  id: string,
  status: AdminProfile['status']
): Promise<AdminActionResponse> {
  const check = await verifyIsAdmin();
  if (!check.isAdmin) {
    return { success: false, error: check.error || 'Acesso negado.' };
  }

  const user = adminProfiles.find((u) => u.id === id);
  if (user) user.status = status;

  if (hasSupabase()) {
    try {
      const supabaseAdmin = getSupabaseAdmin();
      if (supabaseAdmin) {
        await supabaseAdmin
          .from('profiles')
          .update({ status })
          .eq('id', id);
      } else {
        const supabase = await createServerSupabase();
        const { error } = await supabase
          .from('profiles')
          .update({ status })
          .eq('id', id);

        if (error) {
          return { success: false, error: error.message };
        }
      }
    } catch (err) {
      console.warn('toggleAdminUserStatusAction: Erro no Supabase:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao alterar status.' };
    }
  }

  revalidatePath('/admin/usuarios');
  return { success: true, id };
}

/** Excluir usuário administrador */
export async function deleteAdminUserAction(id: string): Promise<AdminActionResponse> {
  const check = await verifyIsAdmin();
  if (!check.isAdmin) {
    return { success: false, error: check.error || 'Acesso negado.' };
  }

  const idx = adminProfiles.findIndex((u) => u.id === id);
  if (idx > -1) adminProfiles.splice(idx, 1);

  if (hasSupabase()) {
    try {
      const supabaseAdmin = getSupabaseAdmin();
      if (supabaseAdmin) {
        await supabaseAdmin.from('profiles').delete().eq('id', id);
        await supabaseAdmin.auth.admin.deleteUser(id);
      } else {
        const supabase = await createServerSupabase();
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) {
          return { success: false, error: error.message };
        }
      }
    } catch (err) {
      console.warn('deleteAdminUserAction: Erro no Supabase:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao excluir usuário.' };
    }
  }

  revalidatePath('/admin/usuarios');
  return { success: true, id };
}
