import { Pencil } from 'lucide-react';
import Link from 'next/link';

import { ProdutoDeleteButton } from '@/components/produto-delete-button';
import { listarProdutos } from '@/services/produto.service';

export const dynamic = 'force-dynamic';

function formatDataValidade(data: Date | null): string {
  if (!data) {
    return '-';
  }

  return data.toLocaleDateString('pt-BR');
}

export default async function ProdutosPage() {
  const produtos = await listarProdutos();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link
          href="/produtos/novo"
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Novo Produto
        </Link>
      </div>

      {produtos.length === 0 ? (
        <p className="text-sm text-gray-600">Nenhum produto cadastrado.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Código de Barras</th>
                <th className="px-4 py-3">Estoque</th>
                <th className="px-4 py-3">Validade</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{produto.nome}</td>
                  <td className="px-4 py-3 text-gray-600">{produto.categoria}</td>
                  <td className="px-4 py-3 text-gray-600">{produto.codigoBarras ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{produto.quantidadeEstoque}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDataValidade(produto.dataValidade)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/produtos/${produto.id}/editar`}
                        aria-label="Editar"
                        title="Editar"
                        className="text-gray-600 transition-colors hover:text-gray-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <ProdutoDeleteButton id={produto.id} nome={produto.nome} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
