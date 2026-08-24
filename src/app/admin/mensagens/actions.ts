'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { contactMessages } from '@/lib/mock-data';
import { ContactMessage } from '@/types';

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/**
 * Server Action: Envio de mensagem a partir de qualquer formulário público
 * (Contato, Faça Parte, Negócios Sociais, Canal de Escuta, etc.)
 */
export async function submitContactMessageAction(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isAnonymous?: boolean;
}) {
  const finalId = `msg-${Date.now()}`;
  const now = new Date();
  const formattedDate = now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace('.', '') + ` — ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const newMsg: ContactMessage = {
    id: finalId,
    name: data.isAnonymous ? 'Anônimo' : data.name,
    email: data.isAnonymous ? 'canal-escuta@sistema.interno' : data.email,
    phone: data.phone || undefined,
    subject: data.subject,
    message: data.message,
    status: 'pendente',
    isAnonymous: data.isAnonymous ?? false,
    receivedAt: formattedDate,
  };

  // Salva no mock-data local (memória)
  contactMessages.unshift(newMsg);

  // Persiste no Supabase se configurado
  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const payload = {
        id: finalId,
        name: newMsg.name,
        email: newMsg.email,
        phone: newMsg.phone || null,
        subject: newMsg.subject,
        message: newMsg.message,
        status: 'pendente',
        is_anonymous: newMsg.isAnonymous,
        received_at: formattedDate,
      };

      const { error } = await supabase.from('contact_messages').insert(payload);
      if (error) {
        console.warn('submitContactMessageAction: Aviso no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('submitContactMessageAction: Erro no Supabase:', err);
    }
  }

  revalidatePath('/admin/mensagens');
  revalidatePath('/admin');

  return {
    success: true,
    message: 'Mensagem enviada com sucesso! Obrigada por entrar em contato. Em breve, a equipe responsável dará continuidade ao atendimento.',
  };
}

/** Atualizar status de uma mensagem (respondido, arquivado, pendente) */
export async function updateMessageStatusAction(
  id: string,
  status: 'pendente' | 'respondido' | 'arquivado'
) {
  const msg = contactMessages.find((m) => m.id === id);
  if (msg) {
    msg.status = status;
    if (status === 'respondido') {
      msg.resolvedAt = new Date().toLocaleString('pt-BR');
    }
  }

  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('contact_messages')
        .update({
          status,
          resolved_at: status === 'respondido' ? new Date().toISOString() : null,
        })
        .eq('id', id);

      if (error) {
        console.warn('updateMessageStatusAction: Aviso no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('updateMessageStatusAction: Erro no Supabase:', err);
    }
  }

  revalidatePath('/admin/mensagens');
  revalidatePath('/admin');

  return { success: true };
}
