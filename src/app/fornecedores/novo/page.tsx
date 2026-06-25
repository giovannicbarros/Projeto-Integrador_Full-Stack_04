import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { FornecedorForm } from '@/components/fornecedor-form';

export default function NovoFornecedorPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cadastro de Fornecedor</h1>
        <Link href="/" className="rounded p-2 hover:bg-gray-100" aria-label="Voltar">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </header>
      <FornecedorForm />
    </main>
  );
}
