'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { newsPosts } from '@/lib/mock-data';
import { NewsPost } from '@/types';

const hasSupabase = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Salvar (criar ou atualizar) uma notícia */
export async function saveNewsAction(data: Omit<NewsPost, 'readTime'>) {
  if (!hasSupabase()) {
    // Modo Simulação
    const idx = data.id ? newsPosts.findIndex((n) => n.id === data.id) : -1;
    const post: NewsPost = { ...data };
    if (idx > -1) {
      newsPosts[idx] = post;
    } else {
      post.id = `mock-news-${Date.now()}`;
      newsPosts.push(post);
    }
  } else {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('news_posts').upsert({
        id: data.id || undefined,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        image_url: data.imageUrl,
        category: data.category,
        date: data.date,
        author: data.author,
        featured: data.featured ?? false,
        published_status: data.publishedStatus,
      });
      if (error) throw error;
    } catch (err) {
      console.error('saveNewsAction: Falha no Supabase', err);
      throw new Error('Falha ao salvar a notícia no banco de dados.');
    }
  }

  revalidatePath('/noticias');
  revalidatePath(`/noticias/${data.slug}`);
  revalidatePath('/');
  revalidatePath('/admin/noticias');
}

/** Excluir uma notícia pelo ID */
export async function deleteNewsAction(id: string) {
  if (!hasSupabase()) {
    const idx = newsPosts.findIndex((n) => n.id === id);
    if (idx > -1) newsPosts.splice(idx, 1);
  } else {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from('news_posts').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('deleteNewsAction: Falha no Supabase', err);
      throw new Error('Falha ao excluir a notícia.');
    }
  }

  revalidatePath('/noticias');
  revalidatePath('/');
  revalidatePath('/admin/noticias');
}

/** Alternar status de publicação rapidamente */
export async function toggleNewsStatusAction(
  id: string,
  publishedStatus: 'publicado' | 'rascunho'
) {
  if (!hasSupabase()) {
    const post = newsPosts.find((n) => n.id === id);
    if (post) post.publishedStatus = publishedStatus;
  } else {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from('news_posts')
        .update({ published_status: publishedStatus })
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('toggleNewsStatusAction: Falha no Supabase', err);
      throw new Error('Falha ao atualizar status.');
    }
  }

  revalidatePath('/noticias');
  revalidatePath('/admin/noticias');
}
