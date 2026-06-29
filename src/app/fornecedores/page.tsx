import { Pencil } from 'lucide-react';
import Link from 'next/link';

import { FornecedorDeleteButton } from '@/components/fornecedor-delete-button';
import { Pagination } from '@/components/pagination';
import { listarFornecedoresPaginado } from '@/services/fornecedor.service';
import { formatCnpj } from '@/utils/cnpj';
import { formatPhone } from '@/utils/phone';

export const dynamic = 'force-dynamic';

interface FornecedoresPageProps {
  searchParams: Promise<{ page?: string }>;
}

function parsePageParam(rawPage: string | undefined): number {
  const parsed = Number(rawPage);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default async function FornecedoresPage({ searchParams }: FornecedoresPageProps) {
  const { page: rawPage } = await searchParams;
  const requestedPage = parsePageParam(rawPage);

  const {
    items: fornecedores,
    page,
    pageSize,
    totalPages,
  } = await listarFornecedoresPaginado(requestedPage);

  const startIndex = (page - 1) * pageSize;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Fornecedores</h1>
        <Link
          href="/fornecedores/novo"
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Novo Fornecedor
        </Link>
      </div>

      {fornecedores.length === 0 ? (
        <p className="text-sm text-gray-600">Nenhum fornecedor cadastrado.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded border border-gray-200">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Empresa</th>
                  <th className="px-4 py-3">Cidade/UF</th>
                  <th className="px-4 py-3">CNPJ</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fornecedores.map((fornecedor, index) => (
                  <tr key={fornecedor.id}>
                    <td className="px-4 py-3 text-gray-500">{startIndex + index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {fornecedor.nomeEmpresa}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {fornecedor.cidade}/{fornecedor.uf}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatCnpj(fornecedor.cnpj)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatPhone(fornecedor.telefone)}</td>
                    <td className="px-4 py-3 text-gray-600">{fornecedor.email}</td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-4">
                        <Link
                          href={`/fornecedores/${fornecedor.id}/editar`}
                          aria-label="Editar"
                          title="Editar"
                          className="text-gray-600 transition-colors hover:text-gray-900"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <FornecedorDeleteButton
                          id={fornecedor.id}
                          nomeEmpresa={fornecedor.nomeEmpresa}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} basePath="/fornecedores" />
        </>
      )}
    </div>
  );
}
