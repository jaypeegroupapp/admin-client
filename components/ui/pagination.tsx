"use client";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  pageCount,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  /** Generate small window of page numbers */
  const getPageNumbers = () => {
    const pages = [];

    const start = Math.max(0, currentPage - 2);
    const end = Math.min(pageCount - 1, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 mt-8">
      {/* Previous Button */}
      <button
        disabled={currentPage <= 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="
          px-4 py-2 rounded-lg border bg-white text-gray-700
          hover:bg-gray-100 transition disabled:opacity-40 disabled:hover:bg-white
        "
      >
        ← Prev
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`
              w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium
              border transition
              ${
                currentPage === p
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }
            `}
          >
            {p + 1}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        disabled={currentPage >= pageCount - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="
          px-4 py-2 rounded-lg border bg-white text-gray-700
          hover:bg-gray-100 transition disabled:opacity-40 disabled:hover:bg-white
        "
      >
        Next →
      </button>
    </div>
  );
}
