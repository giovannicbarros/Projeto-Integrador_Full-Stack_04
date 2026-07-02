import type { Fornecedor, Produto } from '@/generated/prisma/client';

export type { Produto };

export type CreateProdutoDTO = Omit<Produto, 'id' | 'createdAt' | 'updatedAt'>;

export type ProdutoComFornecedores = Produto & {
  fornecedores: Fornecedor[];
};
