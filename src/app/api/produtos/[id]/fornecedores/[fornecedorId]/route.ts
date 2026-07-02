import { NextResponse } from 'next/server';

import {
  AssociacaoNaoEncontradaError,
  desassociarFornecedorDoProduto,
} from '@/services/produto-fornecedor.service';
import { ProdutoNaoEncontradoError } from '@/services/produto.service';

interface RouteParams {
  params: Promise<{ id: string; fornecedorId: string }>;
}

function parseId(rawId: string): number | null {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function DELETE(_request: Request, { params }: RouteParams): Promise<NextResponse> {
  const { id: rawId, fornecedorId: rawFornecedorId } = await params;
  const produtoId = parseId(rawId);
  const fornecedorId = parseId(rawFornecedorId);

  if (produtoId === null || fornecedorId === null) {
    return NextResponse.json({ success: false, error: 'ID inválido.' }, { status: 400 });
  }

  try {
    await desassociarFornecedorDoProduto(produtoId, fornecedorId);

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    if (error instanceof ProdutoNaoEncontradoError || error instanceof AssociacaoNaoEncontradaError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }

    console.error('[DELETE /api/produtos/[id]/fornecedores/[fornecedorId]]', error);

    return NextResponse.json(
      { success: false, error: 'Erro interno ao desassociar fornecedor.' },
      { status: 500 },
    );
  }
}
