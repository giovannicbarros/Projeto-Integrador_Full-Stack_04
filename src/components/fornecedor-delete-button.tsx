'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

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
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(): Promise<void> {
    const confirmado = window.confirm(
      `Tem certeza que deseja excluir o fornecedor "${nomeEmpresa}"?`,
    );

    if (!confirmado) {
      return;
    }

    setIsDeleting(true);

    const response = await fetch(`/api/fornecedores/${id}`, { method: 'DELETE' });
    const result: ApiResponse = await response.json();

    setIsDeleting(false);

    if (!result.success) {
      toast.error(result.error ?? 'Erro ao excluir fornecedor.');
      return;
    }

    toast.success('Fornecedor excluído com sucesso!');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 transition-colors hover:text-red-700 disabled:opacity-50"
    >
      Excluir
    </button>
  );
}
