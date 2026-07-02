import { prisma } from '@/lib/prisma';
import type { ProdutoFornecedor } from '@/generated/prisma/client';
import type { Fornecedor } from '@/types/fornecedor';

export function findAssociacao(
  produtoId: number,
  fornecedorId: number,
): Promise<ProdutoFornecedor | null> {
  return prisma.produtoFornecedor.findUnique({
    where: { produtoId_fornecedorId: { produtoId, fornecedorId } },
  });
}

export function createAssociacao(
  produtoId: number,
  fornecedorId: number,
): Promise<ProdutoFornecedor> {
  return prisma.produtoFornecedor.create({ data: { produtoId, fornecedorId } });
}

export function deleteAssociacao(
  produtoId: number,
  fornecedorId: number,
): Promise<ProdutoFornecedor> {
  return prisma.produtoFornecedor.delete({
    where: { produtoId_fornecedorId: { produtoId, fornecedorId } },
  });
}

export function findFornecedoresByProdutoId(produtoId: number): Promise<Fornecedor[]> {
  return prisma.fornecedor.findMany({
    where: { produtos: { some: { produtoId } } },
    orderBy: { nomeEmpresa: 'asc' },
  });
}
