import { z } from 'zod';

import { UF_VALUES } from '@/constants/uf';
import { unformatCep } from '@/utils/cep';
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
  logradouro: z.string().trim().min(1, 'Endereço é obrigatório.').max(150),
  numero: z.string().trim().min(1, 'Número é obrigatório.').max(10),
  bairro: z.string().trim().min(1, 'Bairro é obrigatório.').max(100),
  cidade: z.string().trim().min(1, 'Cidade é obrigatória.').max(100),
  uf: z.enum(UF_VALUES, { message: 'UF inválida.' }),
  cep: z
    .string()
    .min(1, 'CEP é obrigatório.')
    .transform(unformatCep)
    .refine((value) => value.length === 8, 'CEP deve conter 8 dígitos.'),
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

const MAX_IMAGEM_BASE64_LENGTH = 2_796_203; // ~2MB em base64 (2MB * 4/3, com margem)

// Schema usado pelo formulário: todos os valores chegam como string (inputs HTML),
// e são transformados no tipo final (number/Date/null) aceito pela camada de serviço.
export const produtoSchema = z.object({
  nome: z.string().trim().min(1, 'Nome do produto é obrigatório.').max(150),
  codigoBarras: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ''))
    .refine((value) => value.length <= 20, 'Código de barras deve ter no máximo 20 dígitos.')
    .transform((value) => (value.length === 0 ? null : value)),
  descricao: z.string().trim().min(1, 'Descrição é obrigatória.'),
  quantidadeEstoque: z
    .string()
    .trim()
    .transform((value) => (value.length === 0 ? 0 : Number(value)))
    .refine((value) => !Number.isNaN(value), 'Quantidade em estoque deve ser um número.')
    .refine((value) => Number.isInteger(value), 'Quantidade deve ser um número inteiro.')
    .refine((value) => value >= 0, 'Quantidade não pode ser negativa.'),
  categoria: z.string().trim().min(1, 'Categoria é obrigatória.').max(100),
  dataValidade: z
    .string()
    .trim()
    .transform((value) => (value.length === 0 ? null : new Date(value)))
    .refine((value) => value === null || !Number.isNaN(value.getTime()), 'Data de validade inválida.'),
  imagemBase64: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || value.startsWith('data:image/'),
      'Arquivo de imagem inválido.',
    )
    .refine((value) => value.length <= MAX_IMAGEM_BASE64_LENGTH, 'A imagem deve ter no máximo 2MB.')
    .transform((value) => (value.length === 0 ? null : value)),
});

export type ProdutoFormInput = z.input<typeof produtoSchema>;
export type ProdutoFormValues = z.infer<typeof produtoSchema>;

// Schema usado pela API: o formulário já envia o produto no formato final (DTO),
// serializado em JSON (number permanece number, Date vira string ISO, null permanece null).
export const produtoApiSchema = z.object({
  nome: z.string().trim().min(1, 'Nome do produto é obrigatório.').max(150),
  codigoBarras: z
    .string()
    .nullable()
    .optional()
    .transform((value) => (value ?? '').replace(/\D/g, ''))
    .refine((value) => value.length <= 20, 'Código de barras deve ter no máximo 20 dígitos.')
    .transform((value) => (value.length === 0 ? null : value)),
  descricao: z.string().trim().min(1, 'Descrição é obrigatória.'),
  quantidadeEstoque: z
    .number({ message: 'Quantidade em estoque deve ser um número.' })
    .int('Quantidade deve ser um número inteiro.')
    .min(0, 'Quantidade não pode ser negativa.'),
  categoria: z.string().trim().min(1, 'Categoria é obrigatória.').max(100),
  dataValidade: z
    .union([z.string(), z.date()])
    .nullable()
    .optional()
    .transform((value) => (value === null || value === undefined || value === '' ? null : new Date(value)))
    .refine((value) => value === null || !Number.isNaN(value.getTime()), 'Data de validade inválida.'),
  imagemBase64: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => !value || value.startsWith('data:image/'),
      'Arquivo de imagem inválido.',
    )
    .refine(
      (value) => !value || value.length <= MAX_IMAGEM_BASE64_LENGTH,
      'A imagem deve ter no máximo 2MB.',
    )
    .transform((value) => (value && value.length > 0 ? value : null)),
});

export const associarFornecedorSchema = z.object({
  fornecedorId: z.number().int().positive(),
});
