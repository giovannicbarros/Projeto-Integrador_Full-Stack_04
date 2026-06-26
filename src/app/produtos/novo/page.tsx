import { ProdutoForm } from '@/components/produto-form';

export default function NovoProdutoPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="mb-6 text-2xl font-bold">Cadastro de Produto</h1>
      <ProdutoForm />
    </div>
  );
}
