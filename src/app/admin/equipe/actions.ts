'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { teamMembers } from '@/lib/mock-data';
import { TeamMember } from '@/types';

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Salvar ou atualizar membro da equipe */
export async function saveMemberAction(data: TeamMember) {
  if (!hasSupabase()) {
    const idx = data.id ? teamMembers.findIndex((m) => m.id === data.id) : -1;
    if (idx > -1) {
      teamMembers[idx] = data;
    } else {
      data.id = `mock-member-${Date.now()}`;
      teamMembers.push(data);
    }
  } else {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('team_members').upsert({
        id: data.id || undefined,
        name: data.name,
        role: data.role,
        mandate: data.mandate || null,
        display_order: data.displayOrder,
        image_url: data.imageUrl,
        bio: data.bio || null,
        linkedin_url: data.linkedinUrl || null,
        email: data.email || null,
      });
      if (error) throw error;
    } catch (err) {
      console.error('saveMemberAction: Falha no Supabase', err);
      throw new Error('Falha ao salvar membro no banco de dados.');
    }
  }

  revalidatePath('/quem-somos');
  revalidatePath('/admin/equipe');
}

/** Excluir membro pelo ID */
export async function deleteMemberAction(id: string) {
  if (!hasSupabase()) {
    const idx = teamMembers.findIndex((m) => m.id === id);
    if (idx > -1) teamMembers.splice(idx, 1);
  } else {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('deleteMemberAction: Falha no Supabase', err);
      throw new Error('Falha ao excluir membro.');
    }
  }

  revalidatePath('/quem-somos');
  revalidatePath('/admin/equipe');
}
