import { FornecedorForm } from '@/components/fornecedor-form';

export default function NovoFornecedorPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="mb-6 text-2xl font-bold">Cadastro de Fornecedor</h1>
      <FornecedorForm />
    </div>
  );
}
