import { prisma } from '@/lib/prisma';
import type { CreateFornecedorDTO, Fornecedor } from '@/types/fornecedor';

export function createFornecedor(data: CreateFornecedorDTO): Promise<Fornecedor> {
  return prisma.fornecedor.create({ data });
}

export function findFornecedorByCnpj(cnpj: string): Promise<Fornecedor | null> {
  return prisma.fornecedor.findUnique({ where: { cnpj } });
}

export function findAllFornecedores(): Promise<Fornecedor[]> {
  return prisma.fornecedor.findMany({ orderBy: { nomeEmpresa: 'asc' } });
}

export function findFornecedoresPaginated(skip: number, take: number): Promise<Fornecedor[]> {
  return prisma.fornecedor.findMany({ orderBy: { nomeEmpresa: 'asc' }, skip, take });
}

export function countFornecedores(): Promise<number> {
  return prisma.fornecedor.count();
}

export function findFornecedorById(id: number): Promise<Fornecedor | null> {
  return prisma.fornecedor.findUnique({ where: { id } });
}

export function updateFornecedor(id: number, data: CreateFornecedorDTO): Promise<Fornecedor> {
  return prisma.fornecedor.update({ where: { id }, data });
}

export function deleteFornecedor(id: number): Promise<Fornecedor> {
  return prisma.fornecedor.delete({ where: { id } });
}
