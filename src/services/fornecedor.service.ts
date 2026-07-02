import { Prisma } from '@/generated/prisma/client';
import {
  countFornecedores,
  createFornecedor,
  deleteFornecedor,
  findAllFornecedores,
  findFornecedorByCnpj,
  findFornecedorById,
  findFornecedoresPaginated,
  updateFornecedor,
} from '@/repositories/fornecedor.repository';
import type { CreateFornecedorDTO, Fornecedor } from '@/types/fornecedor';
import type { PaginatedResult } from '@/types/pagination';

const CNPJ_UNIQUE_CONSTRAINT_ERROR_CODE = 'P2002';

export class CnpjDuplicadoError extends Error {
  constructor() {
    super('Fornecedor com esse CNPJ já está cadastrado!');
    this.name = 'CnpjDuplicadoError';
  }
}

export class FornecedorNaoEncontradoError extends Error {
  constructor() {
    super('Fornecedor não encontrado.');
    this.name = 'FornecedorNaoEncontradoError';
  }
}

export async function cadastrarFornecedor(data: CreateFornecedorDTO): Promise<Fornecedor> {
  const fornecedorExistente = await findFornecedorByCnpj(data.cnpj);

  if (fornecedorExistente) {
    throw new CnpjDuplicadoError();
  }

  try {
    return await createFornecedor(data);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === CNPJ_UNIQUE_CONSTRAINT_ERROR_CODE
    ) {
      throw new CnpjDuplicadoError();
    }

    throw error;
  }
}

export function listarFornecedores(): Promise<Fornecedor[]> {
  return findAllFornecedores();
}

export function contarFornecedores(): Promise<number> {
  return countFornecedores();
}

export const FORNECEDORES_PAGE_SIZE = 10;

export async function listarFornecedoresPaginado(
  page: number,
): Promise<PaginatedResult<Fornecedor>> {
  const total = await countFornecedores();
  const totalPages = Math.max(1, Math.ceil(total / FORNECEDORES_PAGE_SIZE));
  const paginaAtual = Math.min(Math.max(1, page), totalPages);
  const skip = (paginaAtual - 1) * FORNECEDORES_PAGE_SIZE;

  const items = await findFornecedoresPaginated(skip, FORNECEDORES_PAGE_SIZE);

  return {
    items,
    total,
    page: paginaAtual,
    pageSize: FORNECEDORES_PAGE_SIZE,
    totalPages,
  };
}

export async function buscarFornecedorPorId(id: number): Promise<Fornecedor> {
  const fornecedor = await findFornecedorById(id);

  if (!fornecedor) {
    throw new FornecedorNaoEncontradoError();
  }

  return fornecedor;
}

export async function atualizarFornecedor(
  id: number,
  data: CreateFornecedorDTO,
): Promise<Fornecedor> {
  const fornecedorExistente = await findFornecedorById(id);

  if (!fornecedorExistente) {
    throw new FornecedorNaoEncontradoError();
  }

  const fornecedorComMesmoCnpj = await findFornecedorByCnpj(data.cnpj);

  if (fornecedorComMesmoCnpj && fornecedorComMesmoCnpj.id !== id) {
    throw new CnpjDuplicadoError();
  }

  try {
    return await updateFornecedor(id, data);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === CNPJ_UNIQUE_CONSTRAINT_ERROR_CODE
    ) {
      throw new CnpjDuplicadoError();
    }

    throw error;
  }
}

export async function excluirFornecedor(id: number): Promise<void> {
  const fornecedorExistente = await findFornecedorById(id);

  if (!fornecedorExistente) {
    throw new FornecedorNaoEncontradoError();
  }

  await deleteFornecedor(id);
}
