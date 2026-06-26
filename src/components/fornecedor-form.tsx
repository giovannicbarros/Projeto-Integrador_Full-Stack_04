'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { UF_OPTIONS } from '@/constants/uf';
import { fornecedorSchema, type FornecedorFormValues } from '@/lib/validations';
import type { Fornecedor } from '@/types/fornecedor';
import { formatCep } from '@/utils/cep';
import { formatCnpj } from '@/utils/cnpj';
import { formatPhone } from '@/utils/phone';

interface ApiResponse {
  success: boolean;
  error?: string;
}

interface FornecedorFormProps {
  fornecedor?: Fornecedor;
}

const inputClassName =
  'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none';

export function FornecedorForm({ fornecedor }: FornecedorFormProps) {
  const router = useRouter();
  const isEditMode = fornecedor !== undefined;

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FornecedorFormValues>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: fornecedor
      ? {
          nomeEmpresa: fornecedor.nomeEmpresa,
          cnpj: fornecedor.cnpj,
          logradouro: fornecedor.logradouro,
          numero: fornecedor.numero,
          bairro: fornecedor.bairro,
          cidade: fornecedor.cidade,
          uf: fornecedor.uf,
          cep: fornecedor.cep,
          telefone: fornecedor.telefone,
          email: fornecedor.email,
          contatoPrincipal: fornecedor.contatoPrincipal,
        }
      : undefined,
  });

  async function onSubmit(data: FornecedorFormValues): Promise<void> {
    const endpoint = isEditMode ? `/api/fornecedores/${fornecedor.id}` : '/api/fornecedores';
    const method = isEditMode ? 'PUT' : 'POST';

    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result: ApiResponse = await response.json();

    if (!result.success) {
      if (response.status === 409) {
        setError('cnpj', { message: result.error });
        return;
      }

      toast.error(
        result.error ?? (isEditMode ? 'Erro ao atualizar fornecedor.' : 'Erro ao cadastrar fornecedor.'),
      );
      return;
    }

    if (isEditMode) {
      toast.success('Fornecedor atualizado com sucesso!');
      router.push('/fornecedores');
      router.refresh();
    } else {
      toast.success('Fornecedor cadastrado com sucesso!');
      reset();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="nomeEmpresa" className="mb-1 block text-sm font-medium">
          Nome da Empresa
        </label>
        <input
          id="nomeEmpresa"
          className={inputClassName}
          placeholder="Insira o nome da empresa"
          aria-invalid={!!errors.nomeEmpresa}
          {...register('nomeEmpresa')}
        />
        {errors.nomeEmpresa && (
          <p className="mt-1 text-sm text-red-600">{errors.nomeEmpresa.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="cnpj" className="mb-1 block text-sm font-medium">
          CNPJ
        </label>
        <Controller
          name="cnpj"
          control={control}
          render={({ field }) => (
            <input
              id="cnpj"
              className={inputClassName}
              placeholder="00.000.000/0000-00"
              aria-invalid={!!errors.cnpj}
              value={formatCnpj(field.value ?? '')}
              onChange={(event) => field.onChange(event.target.value)}
            />
          )}
        />
        {errors.cnpj && <p className="mt-1 text-sm text-red-600">{errors.cnpj.message}</p>}
      </div>

      <div>
        <label htmlFor="cep" className="mb-1 block text-sm font-medium">
          CEP
        </label>
        <Controller
          name="cep"
          control={control}
          render={({ field }) => (
            <input
              id="cep"
              className={inputClassName}
              placeholder="00000-000"
              aria-invalid={!!errors.cep}
              value={formatCep(field.value ?? '')}
              onChange={(event) => field.onChange(event.target.value)}
            />
          )}
        />
        {errors.cep && <p className="mt-1 text-sm text-red-600">{errors.cep.message}</p>}
      </div>

      <div>
        <label htmlFor="logradouro" className="mb-1 block text-sm font-medium">
          Endereço
        </label>
        <input
          id="logradouro"
          className={inputClassName}
          placeholder="Rua, Avenida..."
          aria-invalid={!!errors.logradouro}
          {...register('logradouro')}
        />
        {errors.logradouro && (
          <p className="mt-1 text-sm text-red-600">{errors.logradouro.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="numero" className="mb-1 block text-sm font-medium">
            Número
          </label>
          <input
            id="numero"
            className={inputClassName}
            placeholder="Número"
            aria-invalid={!!errors.numero}
            {...register('numero')}
          />
          {errors.numero && (
            <p className="mt-1 text-sm text-red-600">{errors.numero.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bairro" className="mb-1 block text-sm font-medium">
            Bairro
          </label>
          <input
            id="bairro"
            className={inputClassName}
            placeholder="Bairro"
            aria-invalid={!!errors.bairro}
            {...register('bairro')}
          />
          {errors.bairro && (
            <p className="mt-1 text-sm text-red-600">{errors.bairro.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cidade" className="mb-1 block text-sm font-medium">
            Cidade
          </label>
          <input
            id="cidade"
            className={inputClassName}
            placeholder="Cidade"
            aria-invalid={!!errors.cidade}
            {...register('cidade')}
          />
          {errors.cidade && (
            <p className="mt-1 text-sm text-red-600">{errors.cidade.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="uf" className="mb-1 block text-sm font-medium">
            UF
          </label>
          <select
            id="uf"
            className={inputClassName}
            aria-invalid={!!errors.uf}
            defaultValue=""
            {...register('uf')}
          >
            <option value="" disabled>
              Selecione...
            </option>
            {UF_OPTIONS.map((uf) => (
              <option key={uf.value} value={uf.value}>
                {uf.label}
              </option>
            ))}
          </select>
          {errors.uf && <p className="mt-1 text-sm text-red-600">{errors.uf.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="telefone" className="mb-1 block text-sm font-medium">
          Telefone
        </label>
        <Controller
          name="telefone"
          control={control}
          render={({ field }) => (
            <input
              id="telefone"
              className={inputClassName}
              placeholder="(00) 0000-0000"
              aria-invalid={!!errors.telefone}
              value={formatPhone(field.value ?? '')}
              onChange={(event) => field.onChange(event.target.value)}
            />
          )}
        />
        {errors.telefone && (
          <p className="mt-1 text-sm text-red-600">{errors.telefone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          className={inputClassName}
          placeholder="exemplo@fornecedor.com"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="contatoPrincipal" className="mb-1 block text-sm font-medium">
          Contato Principal
        </label>
        <input
          id="contatoPrincipal"
          className={inputClassName}
          placeholder="Nome do contato principal"
          aria-invalid={!!errors.contatoPrincipal}
          {...register('contatoPrincipal')}
        />
        {errors.contatoPrincipal && (
          <p className="mt-1 text-sm text-red-600">{errors.contatoPrincipal.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isEditMode ? 'Salvar Alterações' : 'Cadastrar'}
      </button>
    </form>
  );
}
