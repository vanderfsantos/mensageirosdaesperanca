'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { transparencyDocs } from '@/lib/mock-data';
import { TransparencyDoc } from '@/types';

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Salvar ou atualizar documento de transparência */
export async function saveDocumentAction(data: TransparencyDoc) {
  const finalId = data.id && data.id.trim() !== '' ? data.id : `doc-${Date.now()}`;
  const docToSave: TransparencyDoc = {
    ...data,
    id: finalId,
  };

  const idx = transparencyDocs.findIndex((d) => d.id === finalId);
  if (idx > -1) {
    transparencyDocs[idx] = docToSave;
  } else {
    transparencyDocs.unshift(docToSave);
  }

  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const payload = {
        id: finalId,
        title: data.title,
        year: data.year,
        category: data.category,
        status: data.status,
        file_url: data.fileUrl,
        file_size: data.fileSize || '—',
        file_type: data.fileType || 'PDF',
        publish_date: data.publishDate,
      };

      const { error } = await supabase.from('transparency_documents').upsert(payload, {
        onConflict: 'id',
      });

      if (error) {
        console.warn('saveDocumentAction: Aviso no Supabase (mantido em memória):', error.message);
      }
    } catch (err) {
      console.warn('saveDocumentAction: Erro de conexão Supabase (mantido em memória):', err);
    }
  }

  revalidatePath('/transparencia');
  revalidatePath('/admin/transparencia');
  revalidatePath('/admin');
  revalidatePath('/');

  return { success: true, id: finalId };
}

/** Excluir documento pelo ID */
export async function deleteDocumentAction(id: string) {
  const idx = transparencyDocs.findIndex((d) => d.id === id);
  if (idx > -1) transparencyDocs.splice(idx, 1);

  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('transparency_documents')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('deleteDocumentAction: Aviso no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('deleteDocumentAction: Erro no Supabase:', err);
    }
  }

  revalidatePath('/transparencia');
  revalidatePath('/admin/transparencia');
  revalidatePath('/admin');
  revalidatePath('/');

  return { success: true };
}
