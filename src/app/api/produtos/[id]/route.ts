import { NextResponse } from 'next/server';

import { produtoApiSchema } from '@/lib/validations';
import {
  atualizarProduto,
  buscarProdutoPorId,
  CodigoBarrasDuplicadoError,
  excluirProduto,
  ProdutoNaoEncontradoError,
} from '@/services/produto.service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

function parseId(rawId: string): number | null {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_request: Request, { params }: RouteParams): Promise<NextResponse> {
  const { id: rawId } = await params;
  const id = parseId(rawId);

  if (id === null) {
    return NextResponse.json({ success: false, error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const produto = await buscarProdutoPorId(id);

    return NextResponse.json({ success: true, data: produto });
  } catch (error) {
    if (error instanceof ProdutoNaoEncontradoError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }

    console.error('[GET /api/produtos/[id]]', error);

    return NextResponse.json(
      { success: false, error: 'Erro interno ao buscar produto.' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams): Promise<NextResponse> {
  const { id: rawId } = await params;
  const id = parseId(rawId);

  if (id === null) {
    return NextResponse.json({ success: false, error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const body: unknown = await request.json();
    const parsed = produtoApiSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' },
        { status: 400 },
      );
    }

    const produto = await atualizarProduto(id, parsed.data);

    return NextResponse.json({ success: true, data: produto });
  } catch (error) {
    if (error instanceof CodigoBarrasDuplicadoError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 409 });
    }

    if (error instanceof ProdutoNaoEncontradoError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }

    console.error('[PUT /api/produtos/[id]]', error);

    return NextResponse.json(
      { success: false, error: 'Erro interno ao atualizar produto.' },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams): Promise<NextResponse> {
  const { id: rawId } = await params;
  const id = parseId(rawId);

  if (id === null) {
    return NextResponse.json({ success: false, error: 'ID inválido.' }, { status: 400 });
  }

  try {
    await excluirProduto(id);

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    if (error instanceof ProdutoNaoEncontradoError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }

    console.error('[DELETE /api/produtos/[id]]', error);

    return NextResponse.json(
      { success: false, error: 'Erro interno ao excluir produto.' },
      { status: 500 },
    );
  }
}
