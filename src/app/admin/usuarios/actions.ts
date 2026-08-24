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
  if (!hasSupabase()) {
    const idx = data.id ? adminProfiles.findIndex((u) => u.id === data.id) : -1;
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
        id: `usr-${Date.now()}`,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        status: data.status,
        createdAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
      };
      adminProfiles.push(newUser);
    }
  } else {
    try {
      const supabase = await createClient();

      if (data.id) {
        // Atualizar perfil existente
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: data.fullName,
            email: data.email,
            role: data.role,
            status: data.status,
          })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        // Inserir registro na tabela profiles
        const { error } = await supabase.from('profiles').insert({
          full_name: data.fullName,
          email: data.email,
          role: data.role,
          status: data.status,
        });
        if (error) throw error;
      }
    } catch (err) {
      console.error('saveAdminUserAction: Falha no Supabase', err);
      throw new Error('Falha ao salvar administrador no banco de dados.');
    }
  }

  revalidatePath('/admin/usuarios');
}

/** Alterar status do usuário */
export async function toggleAdminUserStatusAction(
  id: string,
  status: 'ativo' | 'convidado' | 'inativo'
) {
  if (!hasSupabase()) {
    const user = adminProfiles.find((u) => u.id === id);
    if (user) user.status = status;
  } else {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('toggleAdminUserStatusAction: Falha no Supabase', err);
      throw new Error('Falha ao atualizar status do usuário.');
    }
  }

  revalidatePath('/admin/usuarios');
}

/** Excluir usuário administrador */
export async function deleteAdminUserAction(id: string) {
  if (!hasSupabase()) {
    const idx = adminProfiles.findIndex((u) => u.id === id);
    if (idx > -1) adminProfiles.splice(idx, 1);
  } else {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('deleteAdminUserAction: Falha no Supabase', err);
      throw new Error('Falha ao excluir usuário.');
    }
  }

  revalidatePath('/admin/usuarios');
}
