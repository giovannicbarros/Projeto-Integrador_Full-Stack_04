import { ArrowRight, Handshake, Package, Truck } from 'lucide-react';
import Link from 'next/link';

import { StatCard } from '@/components/stat-card';
import { contarFornecedores } from '@/services/fornecedor.service';
import { contarProdutos } from '@/services/produto.service';
import {
  contarProdutosComFornecedor,
  listarProdutosParaDivulgacao,
} from '@/services/produto-fornecedor.service';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [totalProdutos, totalFornecedores, totalProdutosComFornecedor, produtosParaDivulgacao] =
    await Promise.all([
      contarProdutos(),
      contarFornecedores(),
      contarProdutosComFornecedor(),
      listarProdutosParaDivulgacao(),
    ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Painel Inicial</h1>
        <p className="text-sm text-gray-600">Sistema de Controle de Estoque</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Package} label="Produtos Cadastrados" value={totalProdutos} href="/produtos" />
        <StatCard
          icon={Truck}
          label="Fornecedores Cadastrados"
          value={totalFornecedores}
          href="/fornecedores"
        />
        <StatCard
          icon={Handshake}
          label="Produtos com Fornecedor Associado"
          value={totalProdutosComFornecedor}
          href="/produtos"
        />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">Produtos para Divulgação</h2>
        <p className="mb-4 text-sm text-gray-600">
          Produtos que já possuem fornecedor associado e estão prontos para serem divulgados.
        </p>

        {produtosParaDivulgacao.length === 0 ? (
          <div className="rounded border border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-600">
              Nenhum produto com fornecedor associado até o momento.
            </p>
            <Link
              href="/produtos"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:underline"
            >
              Associe fornecedores aos produtos em Produtos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {produtosParaDivulgacao.map((produto) => (
                <div key={produto.id} className="overflow-hidden rounded border border-gray-200">
                  {produto.imagemBase64 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={produto.imagemBase64}
                      alt={produto.nome}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-gray-50 text-gray-300">
                      <Package className="h-10 w-10" />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-medium text-gray-900">{produto.nome}</p>
                    <p className="text-xs text-gray-500">{produto.categoria}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {produto.fornecedores.map((fornecedor) => (
                        <span
                          key={fornecedor.id}
                          className="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600"
                        >
                          {fornecedor.nomeEmpresa}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/produtos"
              className="mt-4 flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              Ver todos os produtos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
