'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { transparencyDocs } from '@/lib/mock-data';
import { TransparencyDoc } from '@/types';

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Salvar ou atualizar documento de transparência */
export async function saveDocumentAction(data: TransparencyDoc) {
  if (!hasSupabase()) {
    const idx = data.id ? transparencyDocs.findIndex((d) => d.id === data.id) : -1;
    if (idx > -1) {
      transparencyDocs[idx] = data;
    } else {
      data.id = `mock-doc-${Date.now()}`;
      transparencyDocs.push(data);
    }
  } else {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('transparency_documents').upsert({
        id: data.id || undefined,
        title: data.title,
        year: data.year,
        category: data.category,
        status: data.status,
        file_url: data.fileUrl,
        file_size: data.fileSize,
        file_type: data.fileType,
        publish_date: data.publishDate,
      });
      if (error) throw error;
    } catch (err) {
      console.error('saveDocumentAction: Falha no Supabase', err);
      throw new Error('Falha ao salvar documento no banco de dados.');
    }
  }

  revalidatePath('/transparencia');
  revalidatePath('/admin/transparencia');
}

/** Excluir documento pelo ID */
export async function deleteDocumentAction(id: string) {
  if (!hasSupabase()) {
    const idx = transparencyDocs.findIndex((d) => d.id === id);
    if (idx > -1) transparencyDocs.splice(idx, 1);
  } else {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('transparency_documents')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('deleteDocumentAction: Falha no Supabase', err);
      throw new Error('Falha ao excluir documento.');
    }
  }

  revalidatePath('/transparencia');
  revalidatePath('/admin/transparencia');
}
