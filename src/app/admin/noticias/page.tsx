import { newsPosts } from '@/lib/mock-data';
import NoticiasCrudList from '@/components/admin/NoticiasCrudList';
import { Newspaper } from 'lucide-react';

export const metadata = { title: 'Gerenciar Notícias | Admin — Mensageiros da Esperança' };

export default function AdminNoticiasPage() {
  const posts = [...newsPosts].sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
          <Newspaper className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Notícias e Blog</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {posts.length} {posts.length === 1 ? 'notícia cadastrada' : 'notícias cadastradas'} •{' '}
            {posts.filter((p) => p.publishedStatus === 'publicado').length} publicadas
          </p>
        </div>
      </div>
      <NoticiasCrudList initialPosts={posts} />
    </div>
  );
}
