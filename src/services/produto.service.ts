import { Prisma } from '@/generated/prisma/client';
import {
  countProdutos,
  createProduto,
  deleteProduto,
  findAllProdutos,
  findProdutoByCodigoBarras,
  findProdutoById,
  findProdutosPaginated,
  updateProduto,
} from '@/repositories/produto.repository';
import type { CreateProdutoDTO, Produto } from '@/types/produto';
import type { PaginatedResult } from '@/types/pagination';

const CODIGO_BARRAS_UNIQUE_CONSTRAINT_ERROR_CODE = 'P2002';

export class CodigoBarrasDuplicadoError extends Error {
  constructor() {
    super('Produto com este código de barras já está cadastrado!');
    this.name = 'CodigoBarrasDuplicadoError';
  }
}

export class ProdutoNaoEncontradoError extends Error {
  constructor() {
    super('Produto não encontrado.');
    this.name = 'ProdutoNaoEncontradoError';
  }
}

export async function cadastrarProduto(data: CreateProdutoDTO): Promise<Produto> {
  if (data.codigoBarras) {
    const produtoExistente = await findProdutoByCodigoBarras(data.codigoBarras);

    if (produtoExistente) {
      throw new CodigoBarrasDuplicadoError();
    }
  }

  try {
    return await createProduto(data);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === CODIGO_BARRAS_UNIQUE_CONSTRAINT_ERROR_CODE
    ) {
      throw new CodigoBarrasDuplicadoError();
    }

    throw error;
  }
}

export function listarProdutos(): Promise<Produto[]> {
  return findAllProdutos();
}

export const PRODUTOS_PAGE_SIZE = 10;

export async function listarProdutosPaginado(page: number): Promise<PaginatedResult<Produto>> {
  const total = await countProdutos();
  const totalPages = Math.max(1, Math.ceil(total / PRODUTOS_PAGE_SIZE));
  const paginaAtual = Math.min(Math.max(1, page), totalPages);
  const skip = (paginaAtual - 1) * PRODUTOS_PAGE_SIZE;

  const items = await findProdutosPaginated(skip, PRODUTOS_PAGE_SIZE);

  return {
    items,
    total,
    page: paginaAtual,
    pageSize: PRODUTOS_PAGE_SIZE,
    totalPages,
  };
}

export async function buscarProdutoPorId(id: number): Promise<Produto> {
  const produto = await findProdutoById(id);

  if (!produto) {
    throw new ProdutoNaoEncontradoError();
  }

  return produto;
}

export async function atualizarProduto(id: number, data: CreateProdutoDTO): Promise<Produto> {
  const produtoExistente = await findProdutoById(id);

  if (!produtoExistente) {
    throw new ProdutoNaoEncontradoError();
  }

  if (data.codigoBarras) {
    const produtoComMesmoCodigoBarras = await findProdutoByCodigoBarras(data.codigoBarras);

    if (produtoComMesmoCodigoBarras && produtoComMesmoCodigoBarras.id !== id) {
      throw new CodigoBarrasDuplicadoError();
    }
  }

  try {
    return await updateProduto(id, data);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === CODIGO_BARRAS_UNIQUE_CONSTRAINT_ERROR_CODE
    ) {
      throw new CodigoBarrasDuplicadoError();
    }

    throw error;
  }
}

export async function excluirProduto(id: number): Promise<void> {
  const produtoExistente = await findProdutoById(id);

  if (!produtoExistente) {
    throw new ProdutoNaoEncontradoError();
  }

  await deleteProduto(id);
}
