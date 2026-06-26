import { notFound } from 'next/navigation';

import { ProdutoForm } from '@/components/produto-form';
import { buscarProdutoPorId, ProdutoNaoEncontradoError } from '@/services/produto.service';

interface EditarProdutoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarProdutoPage({ params }: EditarProdutoPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  let produto;

  try {
    produto = await buscarProdutoPorId(id);
  } catch (error) {
    if (error instanceof ProdutoNaoEncontradoError) {
      notFound();
    }

    throw error;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="mb-6 text-2xl font-bold">Editar Produto</h1>
      <ProdutoForm produto={produto} />
    </div>
  );
}
