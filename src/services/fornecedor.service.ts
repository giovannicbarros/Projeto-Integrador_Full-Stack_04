import { Prisma } from '@/generated/prisma/client';
import { createFornecedor, findFornecedorByCnpj } from '@/repositories/fornecedor.repository';
import type { CreateFornecedorDTO, Fornecedor } from '@/types/fornecedor';

const CNPJ_UNIQUE_CONSTRAINT_ERROR_CODE = 'P2002';

export class CnpjDuplicadoError extends Error {
  constructor() {
    super('Fornecedor com esse CNPJ já está cadastrado!');
    this.name = 'CnpjDuplicadoError';
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
