import Link from 'next/link';

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ page, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Paginação" className="mt-4 flex items-center justify-between gap-2">
      <Link
        href={`${basePath}?page=${page - 1}`}
        aria-disabled={!hasPrevious}
        className={
          hasPrevious
            ? 'rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50'
            : 'pointer-events-none rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-300'
        }
      >
        Anterior
      </Link>

      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNumber) => (
          <Link
            key={pageNumber}
            href={`${basePath}?page=${pageNumber}`}
            aria-current={pageNumber === page ? 'page' : undefined}
            className={
              pageNumber === page
                ? 'rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white'
                : 'rounded px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100'
            }
          >
            {pageNumber}
          </Link>
        ))}
      </div>

      <Link
        href={`${basePath}?page=${page + 1}`}
        aria-disabled={!hasNext}
        className={
          hasNext
            ? 'rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50'
            : 'pointer-events-none rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-300'
        }
      >
        Próxima
      </Link>
    </nav>
  );
}
