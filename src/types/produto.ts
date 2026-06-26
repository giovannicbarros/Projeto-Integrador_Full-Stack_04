import type { Produto } from '@/generated/prisma/client';

export type { Produto };

export type CreateProdutoDTO = Omit<Produto, 'id' | 'createdAt' | 'updatedAt'>;
