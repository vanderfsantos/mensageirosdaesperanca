'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { impactStories } from '@/lib/mock-data';
import { ImpactStory } from '@/types';

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Salvar (criar ou atualizar) uma história */
export async function saveStoryAction(data: ImpactStory) {
  if (!hasSupabase()) {
    const idx = data.id ? impactStories.findIndex((s) => s.id === data.id) : -1;
    if (idx > -1) {
      impactStories[idx] = data;
    } else {
      data.id = `mock-story-${Date.now()}`;
      impactStories.push(data);
    }
  } else {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('impact_stories').upsert({
        id: data.id || undefined,
        name: data.name,
        age: data.age ?? null,
        role: data.role,
        project: data.project,
        quote: data.quote,
        story: data.story,
        image_url: data.imageUrl,
        video_url: data.videoUrl || null,
        lgpd_consent: data.lgpdConsent,
      });
      if (error) throw error;
    } catch (err) {
      console.error('saveStoryAction: Falha no Supabase', err);
      throw new Error('Falha ao salvar a história no banco de dados.');
    }
  }

  revalidatePath('/historias');
  revalidatePath('/impacto');
  revalidatePath('/admin/historias');
}

/** Excluir uma história pelo ID */
export async function deleteStoryAction(id: string) {
  if (!hasSupabase()) {
    const idx = impactStories.findIndex((s) => s.id === id);
    if (idx > -1) impactStories.splice(idx, 1);
  } else {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('impact_stories').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('deleteStoryAction: Falha no Supabase', err);
      throw new Error('Falha ao excluir a história.');
    }
  }

  revalidatePath('/historias');
  revalidatePath('/impacto');
  revalidatePath('/admin/historias');
}
