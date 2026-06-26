import Link from "next/link";

export function Navbar() {
  return (
    <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
      <Link href="/" className="text-base font-semibold text-gray-900">
        Controle de Estoque
      </Link>
      <div className="flex items-center gap-4 text-sm font-medium text-gray-600 sm:gap-6">
        <Link href="/" className="transition-colors hover:text-gray-900">
          Início
        </Link>
        <Link href="/fornecedores" className="transition-colors hover:text-gray-900">
          Fornecedores
        </Link>
      </div>
    </nav>
  );
}
