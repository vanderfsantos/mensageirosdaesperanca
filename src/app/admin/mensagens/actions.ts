'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { contactMessages } from '@/lib/mock-data';

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Atualizar status de uma mensagem (respondido, arquivado, pendente) */
export async function updateMessageStatusAction(
  id: string,
  status: 'pendente' | 'respondido' | 'arquivado'
) {
  if (!hasSupabase()) {
    const msg = contactMessages.find((m) => m.id === id);
    if (msg) {
      msg.status = status;
      if (status === 'respondido') {
        msg.resolvedAt = new Date().toLocaleString('pt-BR');
      }
    }
  } else {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('contact_messages')
        .update({
          status,
          resolved_at: status === 'respondido' ? new Date().toISOString() : null,
        })
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('updateMessageStatusAction: Falha no Supabase', err);
      throw new Error('Falha ao atualizar status da mensagem.');
    }
  }

  revalidatePath('/admin/mensagens');
}
