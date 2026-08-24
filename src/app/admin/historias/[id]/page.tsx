import { notFound } from 'next/navigation';
import { impactStories } from '@/lib/mock-data';
import StoryForm from '@/components/admin/StoryForm';

export const metadata = { title: 'Editar História | Admin — Mensageiros da Esperança' };

export default async function EditarHistoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = impactStories.find((s) => s.id === id);
  if (!story) notFound();

  return <StoryForm initialData={story} />;
}
