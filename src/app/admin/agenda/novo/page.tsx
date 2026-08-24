import React from 'react';
import CourseForm from '@/components/admin/CourseForm';

export const metadata = {
  title: 'Novo Curso | Painel Mensageiros da Esperança',
  description: 'Cadastrar nova oficina ou evento na agenda da instituição.',
};

export default function AdminNewCoursePage() {
  return (
    <div className="space-y-6">
      <CourseForm initialData={null} />
    </div>
  );
}
