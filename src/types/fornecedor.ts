import type { Fornecedor } from '@/generated/prisma/client';

export type { Fornecedor };

export type CreateFornecedorDTO = Omit<Fornecedor, 'id' | 'createdAt' | 'updatedAt'>;
