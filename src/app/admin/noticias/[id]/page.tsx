import { notFound } from 'next/navigation';
import { newsPosts } from '@/lib/mock-data';
import NewsForm from '@/components/admin/NewsForm';

export const metadata = { title: 'Editar Notícia | Admin — Mensageiros da Esperança' };

export default async function EditarNoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = newsPosts.find((n) => n.id === id);
  if (!post) notFound();

  return <NewsForm initialData={post} />;
}
