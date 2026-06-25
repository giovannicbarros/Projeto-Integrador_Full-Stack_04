'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { fornecedorSchema, type FornecedorFormValues } from '@/lib/validations';
import { formatCnpj } from '@/utils/cnpj';
import { formatPhone } from '@/utils/phone';

interface ApiResponse {
  success: boolean;
  error?: string;
}

const inputClassName =
  'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none';

export function FornecedorForm() {
  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FornecedorFormValues>({ resolver: zodResolver(fornecedorSchema) });

  async function onSubmit(data: FornecedorFormValues): Promise<void> {
    const response = await fetch('/api/fornecedores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result: ApiResponse = await response.json();

    if (!result.success) {
      if (response.status === 409) {
        setError('cnpj', { message: result.error });
        return;
      }

      toast.error(result.error ?? 'Erro ao cadastrar fornecedor.');
      return;
    }

    toast.success('Fornecedor cadastrado com sucesso!');
    reset();
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
        <label htmlFor="endereco" className="mb-1 block text-sm font-medium">
          Endereço
        </label>
        <textarea
          id="endereco"
          className={inputClassName}
          placeholder="Insira o endereço completo da empresa"
          aria-invalid={!!errors.endereco}
          {...register('endereco')}
        />
        {errors.endereco && (
          <p className="mt-1 text-sm text-red-600">{errors.endereco.message}</p>
        )}
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
        Cadastrar
      </button>
    </form>
  );
}
