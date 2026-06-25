import { prisma } from '@/lib/prisma';
import type { CreateFornecedorDTO, Fornecedor } from '@/types/fornecedor';

export function createFornecedor(data: CreateFornecedorDTO): Promise<Fornecedor> {
  return prisma.fornecedor.create({ data });
}

export function findFornecedorByCnpj(cnpj: string): Promise<Fornecedor | null> {
  return prisma.fornecedor.findUnique({ where: { cnpj } });
}
