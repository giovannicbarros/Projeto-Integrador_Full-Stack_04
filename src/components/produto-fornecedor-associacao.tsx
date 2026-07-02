'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Modal } from '@/components/modal';
import type { Fornecedor } from '@/types/fornecedor';
import { formatCnpj } from '@/utils/cnpj';

interface ApiResponse {
  success: boolean;
  error?: string;
}

interface ProdutoFornecedorAssociacaoProps {
  produtoId: number;
  fornecedoresDisponiveis: Fornecedor[];
  fornecedoresAssociados: Fornecedor[];
}

const selectClassName =
  'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none';

export function ProdutoFornecedorAssociacao({
  produtoId,
  fornecedoresDisponiveis,
  fornecedoresAssociados,
}: ProdutoFornecedorAssociacaoProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fornecedorSelecionadoId, setFornecedorSelecionadoId] = useState('');
  const [isAssociando, setIsAssociando] = useState(false);
  const [desassociandoId, setDesassociandoId] = useState<number | null>(null);

  async function handleAssociar(): Promise<void> {
    if (!fornecedorSelecionadoId) {
      return;
    }

    setIsAssociando(true);

    const response = await fetch(`/api/produtos/${produtoId}/fornecedores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fornecedorId: Number(fornecedorSelecionadoId) }),
    });
    const result: ApiResponse = await response.json();

    setIsAssociando(false);

    if (!result.success) {
      toast.error(result.error ?? 'Erro ao associar fornecedor.');
      return;
    }

    toast.success('Fornecedor associado com sucesso ao produto!');
    setFornecedorSelecionadoId('');
    setIsModalOpen(false);
    router.refresh();
  }

  async function handleDesassociar(fornecedorId: number): Promise<void> {
    setDesassociandoId(fornecedorId);

    const response = await fetch(`/api/produtos/${produtoId}/fornecedores/${fornecedorId}`, {
      method: 'DELETE',
    });
    const result: ApiResponse = await response.json();

    setDesassociandoId(null);

    if (!result.success) {
      toast.error(result.error ?? 'Erro ao desassociar fornecedor.');
      return;
    }

    toast.success('Fornecedor desassociado com sucesso!');
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Fornecedores Associados</h2>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            disabled={fornecedoresDisponiveis.length === 0}
            className="flex shrink-0 items-center gap-1.5 rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Associar Fornecedor
          </button>
        </div>
        {fornecedoresAssociados.length === 0 ? (
          <p className="text-sm text-gray-600">Nenhum fornecedor associado a este produto.</p>
        ) : (
          <div className="overflow-x-auto rounded border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Fornecedor</th>
                  <th className="px-4 py-3">CNPJ</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fornecedoresAssociados.map((fornecedor) => (
                  <tr key={fornecedor.id}>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {fornecedor.nomeEmpresa}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatCnpj(fornecedor.cnpj)}</td>
                    <td className="px-6 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDesassociar(fornecedor.id)}
                        disabled={desassociandoId === fornecedor.id}
                        className="rounded border border-gray-300 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        Desassociar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={isModalOpen} title="Associar Fornecedor" onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-3">
          <select
            value={fornecedorSelecionadoId}
            onChange={(event) => setFornecedorSelecionadoId(event.target.value)}
            className={selectClassName}
          >
            <option value="" disabled>
              Selecione um fornecedor
            </option>
            {fornecedoresDisponiveis.map((fornecedor) => (
              <option key={fornecedor.id} value={fornecedor.id}>
                {fornecedor.nomeEmpresa}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAssociar}
            disabled={!fornecedorSelecionadoId || isAssociando}
            className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            Associar Fornecedor
          </button>
        </div>
      </Modal>
    </div>
  );
}
