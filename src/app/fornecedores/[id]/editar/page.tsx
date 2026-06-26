import { notFound } from 'next/navigation';

import { FornecedorForm } from '@/components/fornecedor-form';
import { buscarFornecedorPorId, FornecedorNaoEncontradoError } from '@/services/fornecedor.service';

interface EditarFornecedorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarFornecedorPage({ params }: EditarFornecedorPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  let fornecedor;

  try {
    fornecedor = await buscarFornecedorPorId(id);
  } catch (error) {
    if (error instanceof FornecedorNaoEncontradoError) {
      notFound();
    }

    throw error;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="mb-6 text-2xl font-bold">Editar Fornecedor</h1>
      <FornecedorForm fornecedor={fornecedor} />
    </div>
  );
}
