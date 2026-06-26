import { prisma } from '@/lib/prisma';
import type { CreateProdutoDTO, Produto } from '@/types/produto';

export function createProduto(data: CreateProdutoDTO): Promise<Produto> {
  return prisma.produto.create({ data });
}

export function findProdutoByCodigoBarras(codigoBarras: string): Promise<Produto | null> {
  return prisma.produto.findUnique({ where: { codigoBarras } });
}

export function findAllProdutos(): Promise<Produto[]> {
  return prisma.produto.findMany({ orderBy: { nome: 'asc' } });
}

export function findProdutoById(id: number): Promise<Produto | null> {
  return prisma.produto.findUnique({ where: { id } });
}

export function updateProduto(id: number, data: CreateProdutoDTO): Promise<Produto> {
  return prisma.produto.update({ where: { id }, data });
}

export function deleteProduto(id: number): Promise<Produto> {
  return prisma.produto.delete({ where: { id } });
}
