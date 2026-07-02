import { NextResponse } from 'next/server';

import { FornecedorNaoEncontradoError } from '@/services/fornecedor.service';
import {
  associarFornecedorAoProduto,
  FornecedorJaAssociadoError,
} from '@/services/produto-fornecedor.service';
import { ProdutoNaoEncontradoError } from '@/services/produto.service';
import { associarFornecedorSchema } from '@/lib/validations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

function parseId(rawId: string): number | null {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function POST(request: Request, { params }: RouteParams): Promise<NextResponse> {
  const { id: rawId } = await params;
  const produtoId = parseId(rawId);

  if (produtoId === null) {
    return NextResponse.json({ success: false, error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const body: unknown = await request.json();
    const parsed = associarFornecedorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' },
        { status: 400 },
      );
    }

    await associarFornecedorAoProduto(produtoId, parsed.data.fornecedorId);

    return NextResponse.json({ success: true, data: null }, { status: 201 });
  } catch (error) {
    if (error instanceof FornecedorJaAssociadoError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 409 });
    }

    if (error instanceof ProdutoNaoEncontradoError || error instanceof FornecedorNaoEncontradoError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }

    console.error('[POST /api/produtos/[id]/fornecedores]', error);

    return NextResponse.json(
      { success: false, error: 'Erro interno ao associar fornecedor.' },
      { status: 500 },
    );
  }
}
