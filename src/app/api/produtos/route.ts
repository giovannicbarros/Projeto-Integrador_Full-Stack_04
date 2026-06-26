import { NextResponse } from 'next/server';

import { produtoApiSchema } from '@/lib/validations';
import { cadastrarProduto, CodigoBarrasDuplicadoError, listarProdutos } from '@/services/produto.service';

export async function GET(): Promise<NextResponse> {
  try {
    const produtos = await listarProdutos();

    return NextResponse.json({ success: true, data: produtos });
  } catch (error) {
    console.error('[GET /api/produtos]', error);

    return NextResponse.json(
      { success: false, error: 'Erro interno ao listar produtos.' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parsed = produtoApiSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' },
        { status: 400 },
      );
    }

    const produto = await cadastrarProduto(parsed.data);

    return NextResponse.json({ success: true, data: produto }, { status: 201 });
  } catch (error) {
    if (error instanceof CodigoBarrasDuplicadoError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 409 });
    }

    console.error('[POST /api/produtos]', error);

    return NextResponse.json(
      { success: false, error: 'Erro interno ao cadastrar produto.' },
      { status: 500 },
    );
  }
}
