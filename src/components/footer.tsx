export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-gray-500 sm:px-6">
        <p>Projeto Integrador Full-Stack 04 — Sistema de Controle de Estoque</p>
        <p className="mt-1">Trabalho de Conclusão de Curso &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
