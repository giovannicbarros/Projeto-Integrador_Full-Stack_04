import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProdutoFornecedorAssociacao } from '@/components/produto-fornecedor-associacao';
import { listarFornecedores } from '@/services/fornecedor.service';
import { listarFornecedoresDoProduto } from '@/services/produto-fornecedor.service';
import { buscarProdutoPorId, ProdutoNaoEncontradoError } from '@/services/produto.service';

const readOnlyInputClassName =
  'w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700';

interface ProdutoFornecedoresPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProdutoFornecedoresPage({ params }: ProdutoFornecedoresPageProps) {
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

  const [fornecedoresDisponiveis, fornecedoresAssociados] = await Promise.all([
    listarFornecedores(),
    listarFornecedoresDoProduto(id),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Associação de Fornecedor a Produto</h1>
        <Link
          href="/produtos"
          className="flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>

      <div className="mb-8 rounded border border-gray-200 p-4">
        <h2 className="mb-3 text-lg font-semibold">Detalhes do Produto</h2>
        <div className="flex flex-col gap-4">
          {produto.imagemBase64 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={produto.imagemBase64}
              alt={produto.nome}
              className="h-32 w-32 rounded border border-gray-200 object-cover"
            />
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">Nome do Produto</label>
            <input readOnly value={produto.nome} className={readOnlyInputClassName} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Código de Barras</label>
            <input
              readOnly
              value={produto.codigoBarras ?? '-'}
              className={readOnlyInputClassName}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Descrição</label>
            <textarea
              readOnly
              rows={3}
              value={produto.descricao}
              className={readOnlyInputClassName}
            />
          </div>
        </div>
      </div>

      <ProdutoFornecedorAssociacao
        produtoId={produto.id}
        fornecedoresDisponiveis={fornecedoresDisponiveis}
        fornecedoresAssociados={fornecedoresAssociados}
      />
    </div>
  );
}
