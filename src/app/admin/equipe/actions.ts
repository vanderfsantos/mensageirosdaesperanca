'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { teamMembers } from '@/lib/mock-data';
import { TeamMember } from '@/types';

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Salvar ou atualizar membro da equipe */
export async function saveMemberAction(data: TeamMember) {
  const finalId = data.id && data.id.trim() !== '' ? data.id : `member-${Date.now()}`;
  const memberToSave: TeamMember = {
    ...data,
    id: finalId,
  };

  const idx = teamMembers.findIndex((m) => m.id === finalId);
  if (idx > -1) {
    teamMembers[idx] = memberToSave;
  } else {
    teamMembers.push(memberToSave);
  }

  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const payload = {
        id: finalId,
        name: data.name,
        role: data.role,
        mandate: data.mandate || null,
        display_order: data.displayOrder ?? 99,
        image_url: data.imageUrl,
        bio: data.bio || null,
        linkedin_url: data.linkedinUrl || null,
        email: data.email || null,
      };

      const { error } = await supabase.from('team_members').upsert(payload, {
        onConflict: 'id',
      });

      if (error) {
        console.warn('saveMemberAction: Aviso no Supabase (mantido em memória):', error.message);
      }
    } catch (err) {
      console.warn('saveMemberAction: Erro de conexão Supabase (mantido em memória):', err);
    }
  }

  revalidatePath('/quem-somos');
  revalidatePath('/admin/equipe');
  revalidatePath('/admin');
  revalidatePath('/');

  return { success: true, id: finalId };
}

/** Excluir membro pelo ID */
export async function deleteMemberAction(id: string) {
  const idx = teamMembers.findIndex((m) => m.id === id);
  if (idx > -1) teamMembers.splice(idx, 1);

  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) {
        console.warn('deleteMemberAction: Aviso no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('deleteMemberAction: Erro no Supabase:', err);
    }
  }

  revalidatePath('/quem-somos');
  revalidatePath('/admin/equipe');
  revalidatePath('/admin');
  revalidatePath('/');

  return { success: true };
}
