'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/confirm-dialog';

interface ApiResponse {
  success: boolean;
  error?: string;
}

interface FornecedorDeleteButtonProps {
  id: number;
  nomeEmpresa: string;
}

export function FornecedorDeleteButton({ id, nomeEmpresa }: FornecedorDeleteButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(): Promise<void> {
    setIsDeleting(true);

    const response = await fetch(`/api/fornecedores/${id}`, { method: 'DELETE' });
    const result: ApiResponse = await response.json();

    setIsDeleting(false);
    setIsModalOpen(false);

    if (!result.success) {
      toast.error(result.error ?? 'Erro ao excluir fornecedor.');
      return;
    }

    toast.success('Fornecedor excluído com sucesso!');
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Excluir"
        title="Excluir"
        className="text-red-600 transition-colors hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <ConfirmDialog
        open={isModalOpen}
        title="Excluir fornecedor"
        description={`Tem certeza que deseja excluir o fornecedor "${nomeEmpresa}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}
