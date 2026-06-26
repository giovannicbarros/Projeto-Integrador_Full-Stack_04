'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { CATEGORIA_OPTIONS, CATEGORIA_OUTRO } from '@/constants/categoria';
import { produtoSchema, type ProdutoFormInput, type ProdutoFormValues } from '@/lib/validations';
import type { Produto } from '@/types/produto';

interface ApiResponse {
  success: boolean;
  error?: string;
}

interface ProdutoFormProps {
  produto?: Produto;
}

const inputClassName =
  'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none';

function toDateInputValue(date: Date | null): string {
  if (!date) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

function isCategoriaPredefinida(categoria: string): boolean {
  return CATEGORIA_OPTIONS.some((option) => option.value === categoria && option.value !== CATEGORIA_OUTRO);
}

export function ProdutoForm({ produto }: ProdutoFormProps) {
  const router = useRouter();
  const isEditMode = produto !== undefined;

  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>(() => {
    if (!produto) {
      return '';
    }

    return isCategoriaPredefinida(produto.categoria) ? produto.categoria : CATEGORIA_OUTRO;
  });

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormInput, unknown, ProdutoFormValues>({
    resolver: zodResolver(produtoSchema),
    mode: 'onBlur',
    defaultValues: produto
      ? {
          nome: produto.nome,
          codigoBarras: produto.codigoBarras ?? '',
          descricao: produto.descricao,
          quantidadeEstoque: String(produto.quantidadeEstoque),
          categoria: produto.categoria,
          dataValidade: toDateInputValue(produto.dataValidade),
          imagemBase64: produto.imagemBase64 ?? '',
        }
      : {
          nome: '',
          codigoBarras: '',
          descricao: '',
          quantidadeEstoque: '0',
          categoria: '',
          dataValidade: '',
          imagemBase64: '',
        },
  });

  async function onSubmit(data: ProdutoFormValues): Promise<void> {
    const endpoint = isEditMode ? `/api/produtos/${produto.id}` : '/api/produtos';
    const method = isEditMode ? 'PUT' : 'POST';

    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result: ApiResponse = await response.json();

    if (!result.success) {
      if (response.status === 409) {
        setError('codigoBarras', { message: result.error });
        return;
      }

      toast.error(
        result.error ?? (isEditMode ? 'Erro ao atualizar produto.' : 'Erro ao cadastrar produto.'),
      );
      return;
    }

    if (isEditMode) {
      toast.success('Produto atualizado com sucesso!');
      router.push('/produtos');
      router.refresh();
    } else {
      toast.success('Produto cadastrado com sucesso!', {
        onAutoClose: () => router.push('/produtos'),
      });
      reset();
      setCategoriaSelecionada('');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () => {
        toast.info('Verifique os campos destacados em vermelho.');
      })}
      className="flex flex-col gap-4"
    >
      <div>
        <label htmlFor="nome" className="mb-1 block text-sm font-medium">
          Nome do Produto
        </label>
        <input
          id="nome"
          className={inputClassName}
          placeholder="Insira o nome do produto"
          aria-invalid={!!errors.nome}
          {...register('nome')}
        />
        {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>}
      </div>

      <div>
        <label htmlFor="codigoBarras" className="mb-1 block text-sm font-medium">
          Código de Barras
        </label>
        <input
          id="codigoBarras"
          inputMode="numeric"
          className={inputClassName}
          placeholder="Insira o código de barras"
          aria-invalid={!!errors.codigoBarras}
          {...register('codigoBarras')}
        />
        {errors.codigoBarras && (
          <p className="mt-1 text-sm text-red-600">{errors.codigoBarras.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="descricao" className="mb-1 block text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="descricao"
          rows={4}
          className={inputClassName}
          placeholder="Descreva brevemente o produto"
          aria-invalid={!!errors.descricao}
          {...register('descricao')}
        />
        {errors.descricao && (
          <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantidadeEstoque" className="mb-1 block text-sm font-medium">
            Quantidade em Estoque
          </label>
          <input
            id="quantidadeEstoque"
            type="number"
            min={0}
            className={inputClassName}
            placeholder="Quantidade disponível"
            aria-invalid={!!errors.quantidadeEstoque}
            {...register('quantidadeEstoque')}
          />
          {errors.quantidadeEstoque && (
            <p className="mt-1 text-sm text-red-600">{errors.quantidadeEstoque.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="dataValidade" className="mb-1 block text-sm font-medium">
            Data de Validade
          </label>
          <input
            id="dataValidade"
            type="date"
            className={inputClassName}
            aria-invalid={!!errors.dataValidade}
            {...register('dataValidade')}
          />
          {errors.dataValidade && (
            <p className="mt-1 text-sm text-red-600">{errors.dataValidade.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="categoria" className="mb-1 block text-sm font-medium">
          Categoria
        </label>
        <Controller
          name="categoria"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <select
                id="categoria"
                className={inputClassName}
                aria-invalid={!!errors.categoria}
                value={categoriaSelecionada}
                onChange={(event) => {
                  const value = event.target.value;
                  setCategoriaSelecionada(value);
                  field.onChange(value === CATEGORIA_OUTRO ? '' : value);
                }}
                onBlur={field.onBlur}
              >
                <option value="" disabled>
                  Selecione...
                </option>
                {CATEGORIA_OPTIONS.map((categoria) => (
                  <option key={categoria.value} value={categoria.value}>
                    {categoria.label}
                  </option>
                ))}
              </select>

              {categoriaSelecionada === CATEGORIA_OUTRO && (
                <input
                  className={inputClassName}
                  placeholder="Especifique a categoria"
                  aria-invalid={!!errors.categoria}
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.value)}
                  onBlur={field.onBlur}
                />
              )}
            </div>
          )}
        />
        {errors.categoria && (
          <p className="mt-1 text-sm text-red-600">{errors.categoria.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="imagem" className="mb-1 block text-sm font-medium">
          Imagem do Produto
        </label>
        <Controller
          name="imagemBase64"
          control={control}
          render={({ field }) => (
            <div>
              <input
                id="imagem"
                type="file"
                accept="image/*"
                className={inputClassName}
                aria-invalid={!!errors.imagemBase64}
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (!file) {
                    field.onChange('');
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = () => {
                    field.onChange(typeof reader.result === 'string' ? reader.result : '');
                  };
                  reader.readAsDataURL(file);
                }}
                onBlur={field.onBlur}
              />
              {field.value && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={field.value}
                  alt="Pré-visualização do produto"
                  className="mt-2 h-32 w-32 rounded border border-gray-200 object-cover"
                />
              )}
            </div>
          )}
        />
        {errors.imagemBase64 && (
          <p className="mt-1 text-sm text-red-600">{errors.imagemBase64.message}</p>
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
