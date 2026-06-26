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

interface ProdutoDeleteButtonProps {
  id: number;
  nome: string;
}

export function ProdutoDeleteButton({ id, nome }: ProdutoDeleteButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(): Promise<void> {
    setIsDeleting(true);

    const response = await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
    const result: ApiResponse = await response.json();

    setIsDeleting(false);
    setIsModalOpen(false);

    if (!result.success) {
      toast.error(result.error ?? 'Erro ao excluir produto.');
      return;
    }

    toast.success('Produto excluído com sucesso!');
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
        title="Excluir produto"
        description={`Tem certeza que deseja excluir o produto "${nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}
