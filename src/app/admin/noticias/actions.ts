'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { newsPosts } from '@/lib/mock-data';
import { NewsPost } from '@/types';

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Salvar (criar ou atualizar) uma notícia */
export async function saveNewsAction(data: Omit<NewsPost, 'readTime'>) {
  const finalId = data.id && data.id.trim() !== '' ? data.id : `news-${Date.now()}`;
  const post: NewsPost = {
    ...data,
    id: finalId,
    readTime: `${Math.max(1, Math.ceil(data.content.length / 500))} min de leitura`,
  };

  // Atualiza in-memory mock data
  const idx = newsPosts.findIndex((n) => n.id === finalId || n.slug === data.slug);
  if (idx > -1) {
    newsPosts[idx] = post;
  } else {
    newsPosts.unshift(post);
  }

  // Tenta persistir no Supabase
  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const payload = {
        id: finalId,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        image_url: data.imageUrl,
        category: data.category,
        date: data.date,
        author: data.author,
        read_time: post.readTime,
        featured: data.featured ?? false,
        published_status: data.publishedStatus,
      };

      const { error } = await supabase.from('news_posts').upsert(payload, {
        onConflict: 'id',
      });

      if (error) {
        console.warn('saveNewsAction: Aviso no Supabase (mantido em memória):', error.message);
      }
    } catch (err) {
      console.warn('saveNewsAction: Erro de conexão Supabase (mantido em memória):', err);
    }
  }

  revalidatePath('/noticias');
  revalidatePath(`/noticias/${data.slug}`);
  revalidatePath('/');
  revalidatePath('/admin/noticias');
  revalidatePath('/admin');

  return { success: true, id: finalId };
}

/** Excluir uma notícia pelo ID */
export async function deleteNewsAction(id: string) {
  const idx = newsPosts.findIndex((n) => n.id === id);
  if (idx > -1) newsPosts.splice(idx, 1);

  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('news_posts').delete().eq('id', id);
      if (error) {
        console.warn('deleteNewsAction: Aviso no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('deleteNewsAction: Erro no Supabase:', err);
    }
  }

  revalidatePath('/noticias');
  revalidatePath('/');
  revalidatePath('/admin/noticias');
  revalidatePath('/admin');

  return { success: true };
}

/** Alternar status de publicação rapidamente */
export async function toggleNewsStatusAction(
  id: string,
  publishedStatus: 'publicado' | 'rascunho'
) {
  const post = newsPosts.find((n) => n.id === id);
  if (post) post.publishedStatus = publishedStatus;

  if (hasSupabase()) {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('news_posts')
        .update({ published_status: publishedStatus })
        .eq('id', id);

      if (error) {
        console.warn('toggleNewsStatusAction: Aviso no Supabase:', error.message);
      }
    } catch (err) {
      console.warn('toggleNewsStatusAction: Erro no Supabase:', err);
    }
  }

  revalidatePath('/noticias');
  revalidatePath('/admin/noticias');

  return { success: true };
}
