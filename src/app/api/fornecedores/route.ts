import { NextResponse } from 'next/server';

import { fornecedorSchema } from '@/lib/validations';
import { cadastrarFornecedor, CnpjDuplicadoError } from '@/services/fornecedor.service';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parsed = fornecedorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' },
        { status: 400 },
      );
    }

    const fornecedor = await cadastrarFornecedor(parsed.data);

    return NextResponse.json({ success: true, data: fornecedor }, { status: 201 });
  } catch (error) {
    if (error instanceof CnpjDuplicadoError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 409 });
    }

    console.error('[POST /api/fornecedores]', error);

    return NextResponse.json(
      { success: false, error: 'Erro interno ao cadastrar fornecedor.' },
      { status: 500 },
    );
  }
}
