import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-16 text-center sm:py-24">
      <h1 className="text-2xl font-bold sm:text-3xl">Projeto Integrador Full-Stack 04</h1>
      <p className="text-lg text-gray-600">Sistema de Controle de Estoque</p>
      <p className="text-sm font-medium text-green-600">
        Servidor rodando com sucesso 🟢
      </p>
      <Link
        href="/fornecedores"
        className="mt-4 rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
      >
        Ver Fornecedores
      </Link>
    </div>
  );
}
