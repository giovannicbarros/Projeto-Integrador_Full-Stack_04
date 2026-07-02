import { buscarFornecedorPorId } from '@/services/fornecedor.service';
import { buscarProdutoPorId } from '@/services/produto.service';
import {
  countProdutosComFornecedor,
  createAssociacao,
  deleteAssociacao,
  findAssociacao,
  findFornecedoresByProdutoId,
  findProdutosComFornecedores,
} from '@/repositories/produto-fornecedor.repository';
import type { Fornecedor } from '@/types/fornecedor';
import type { ProdutoComFornecedores } from '@/types/produto';

export class FornecedorJaAssociadoError extends Error {
  constructor() {
    super('Fornecedor já está associado a este produto!');
    this.name = 'FornecedorJaAssociadoError';
  }
}

export class AssociacaoNaoEncontradaError extends Error {
  constructor() {
    super('Associação não encontrada.');
    this.name = 'AssociacaoNaoEncontradaError';
  }
}

export async function associarFornecedorAoProduto(
  produtoId: number,
  fornecedorId: number,
): Promise<void> {
  await buscarProdutoPorId(produtoId);
  await buscarFornecedorPorId(fornecedorId);

  const associacaoExistente = await findAssociacao(produtoId, fornecedorId);

  if (associacaoExistente) {
    throw new FornecedorJaAssociadoError();
  }

  await createAssociacao(produtoId, fornecedorId);
}

export async function desassociarFornecedorDoProduto(
  produtoId: number,
  fornecedorId: number,
): Promise<void> {
  await buscarProdutoPorId(produtoId);

  const associacaoExistente = await findAssociacao(produtoId, fornecedorId);

  if (!associacaoExistente) {
    throw new AssociacaoNaoEncontradaError();
  }

  await deleteAssociacao(produtoId, fornecedorId);
}

export function listarFornecedoresDoProduto(produtoId: number): Promise<Fornecedor[]> {
  return findFornecedoresByProdutoId(produtoId);
}

export const PRODUTOS_DIVULGACAO_LIMIT = 6;

export function contarProdutosComFornecedor(): Promise<number> {
  return countProdutosComFornecedor();
}

export function listarProdutosParaDivulgacao(
  limit: number = PRODUTOS_DIVULGACAO_LIMIT,
): Promise<ProdutoComFornecedores[]> {
  return findProdutosComFornecedores(limit);
}
