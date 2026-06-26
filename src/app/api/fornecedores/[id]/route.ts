import { NextResponse } from 'next/server';

import { fornecedorSchema } from '@/lib/validations';
import {
  atualizarFornecedor,
  buscarFornecedorPorId,
  CnpjDuplicadoError,
  excluirFornecedor,
  FornecedorNaoEncontradoError,
} from '@/services/fornecedor.service';

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
    const fornecedor = await buscarFornecedorPorId(id);

    return NextResponse.json({ success: true, data: fornecedor });
  } catch (error) {
    if (error instanceof FornecedorNaoEncontradoError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }

    console.error('[GET /api/fornecedores/[id]]', error);

    return NextResponse.json(
      { success: false, error: 'Erro interno ao buscar fornecedor.' },
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
    const parsed = fornecedorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' },
        { status: 400 },
      );
    }

    const fornecedor = await atualizarFornecedor(id, parsed.data);

    return NextResponse.json({ success: true, data: fornecedor });
  } catch (error) {
    if (error instanceof CnpjDuplicadoError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 409 });
    }

    if (error instanceof FornecedorNaoEncontradoError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }

    console.error('[PUT /api/fornecedores/[id]]', error);

    return NextResponse.json(
      { success: false, error: 'Erro interno ao atualizar fornecedor.' },
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
    await excluirFornecedor(id);

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    if (error instanceof FornecedorNaoEncontradoError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }

    console.error('[DELETE /api/fornecedores/[id]]', error);

    return NextResponse.json(
      { success: false, error: 'Erro interno ao excluir fornecedor.' },
      { status: 500 },
    );
  }
}
