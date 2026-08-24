'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { impactStories } from '@/lib/mock-data';
import { ImpactStory } from '@/types';

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Salvar (criar ou atualizar) uma história */
export async function saveStoryAction(data: ImpactStory) {
  const finalId = data.id && data.id.trim() !== '' ? data.id : `story-${Date.now()}`;
  const storyToSave: ImpactStory = {
    ...data,
    id: finalId,
  };

  const idx = impactStories.findIndex((s) => s.id === finalId);
  if (idx > -1) {
    impactStories[idx] = storyToSave;
  } else {
    impactStories.unshift(storyToSave);
  }

  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const payload = {
        id: finalId,
        name: data.name,
        age: data.age ?? null,
        role: data.role,
        project: data.project,
        quote: data.quote,
        story: data.story,
        image_url: data.imageUrl,
        video_url: data.videoUrl || null,
        lgpd_consent: data.lgpdConsent,
      };

      const { error } = await supabase.from('impact_stories').upsert(payload, {
        onConflict: 'id',
      });

      if (error) {
        console.warn('saveStoryAction: Aviso no Supabase (mantido em memória):', error.message);
      }
    } catch (err) {
      console.warn('saveStoryAction: Erro de conexão Supabase (mantido em memória):', err);
    }
  }

  revalidatePath('/historias');
  revalidatePath('/impacto');
  revalidatePath('/admin/historias');
  revalidatePath('/admin');
  revalidatePath('/');

  return { success: true, id: finalId };
}

/** Excluir uma história pelo ID */
export async function deleteStoryAction(id: string) {
  const idx = impactStories.findIndex((s) => s.id === id);
  if (idx > -1) impactStories.splice(idx, 1);

  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('impact_stories').delete().eq('id', id);
      if (error) {
        console.warn('deleteStoryAction: Aviso no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('deleteStoryAction: Erro no Supabase:', err);
    }
  }

  revalidatePath('/historias');
  revalidatePath('/impacto');
  revalidatePath('/admin/historias');
  revalidatePath('/admin');
  revalidatePath('/');

  return { success: true };
}
