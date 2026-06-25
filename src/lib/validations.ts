import { z } from 'zod';

import { isValidCnpj, unformatCnpj } from '@/utils/cnpj';
import { unformatPhone } from '@/utils/phone';

export const fornecedorSchema = z.object({
  nomeEmpresa: z.string().trim().min(1, 'Nome da empresa é obrigatório.').max(150),
  cnpj: z
    .string()
    .min(1, 'CNPJ é obrigatório.')
    .transform(unformatCnpj)
    .refine((value) => value.length === 14, 'CNPJ deve conter 14 dígitos.')
    .refine(isValidCnpj, 'CNPJ inválido.'),
  endereco: z.string().trim().min(1, 'Endereço é obrigatório.').max(255),
  telefone: z
    .string()
    .min(1, 'Telefone é obrigatório.')
    .transform(unformatPhone)
    .refine(
      (value) => value.length === 10 || value.length === 11,
      'Telefone inválido. Use DDD + número com 8 ou 9 dígitos.',
    ),
  email: z.string().trim().min(1, 'E-mail é obrigatório.').email('E-mail inválido.').max(150),
  contatoPrincipal: z.string().trim().min(1, 'Contato principal é obrigatório.').max(150),
});

export type FornecedorFormValues = z.infer<typeof fornecedorSchema>;
