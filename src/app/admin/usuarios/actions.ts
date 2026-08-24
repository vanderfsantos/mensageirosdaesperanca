'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { adminProfiles } from '@/lib/mock-data';
import { AdminProfile } from '@/types';

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Salvar ou convidar novo usuário administrador */
export async function saveAdminUserAction(data: {
  id?: string;
  fullName: string;
  email: string;
  role: 'admin' | 'editor' | 'comunicacao';
  status: 'ativo' | 'convidado' | 'inativo';
  password?: string;
}) {
  const finalId = data.id && data.id.trim() !== '' ? data.id : `usr-${Date.now()}`;

  const idx = adminProfiles.findIndex((u) => u.id === finalId || u.email === data.email);
  if (idx > -1) {
    adminProfiles[idx] = {
      ...adminProfiles[idx],
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      status: data.status,
    };
  } else {
    const newUser: AdminProfile = {
      id: finalId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      status: data.status,
      createdAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
    };
    adminProfiles.unshift(newUser);
  }

  if (hasSupabase()) {
    try {
      const supabase = await createClient();

      if (data.id) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: data.fullName,
            email: data.email,
            role: data.role,
            status: data.status,
          })
          .eq('id', data.id);

        if (error) {
          console.warn('saveAdminUserAction: Aviso no Supabase:', error.message);
        }
      } else {
        const { error } = await supabase.from('profiles').insert({
          id: finalId,
          full_name: data.fullName,
          email: data.email,
          role: data.role,
          status: data.status,
        });

        if (error) {
          console.warn('saveAdminUserAction: Aviso no Supabase:', error.message);
        }
      }
    } catch (err) {
      console.warn('saveAdminUserAction: Erro no Supabase:', err);
    }
  }

  revalidatePath('/admin/usuarios');
  return { success: true, id: finalId };
}

/** Alterar status do usuário */
export async function toggleAdminUserStatusAction(
  id: string,
  status: 'ativo' | 'convidado' | 'inativo'
) {
  const user = adminProfiles.find((u) => u.id === id);
  if (user) user.status = status;

  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.warn('toggleAdminUserStatusAction: Aviso no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('toggleAdminUserStatusAction: Erro no Supabase:', err);
    }
  }

  revalidatePath('/admin/usuarios');
  return { success: true };
}

/** Excluir usuário administrador */
export async function deleteAdminUserAction(id: string) {
  const idx = adminProfiles.findIndex((u) => u.id === id);
  if (idx > -1) adminProfiles.splice(idx, 1);

  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) {
        console.warn('deleteAdminUserAction: Aviso no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('deleteAdminUserAction: Erro no Supabase:', err);
    }
  }

  revalidatePath('/admin/usuarios');
  return { success: true };
}
