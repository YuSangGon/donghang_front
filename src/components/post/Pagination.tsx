interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onChangePage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index);

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2">
      <button
        type="button"
        disabled={currentPage === 0}
        onClick={() => onChangePage(currentPage - 1)}
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 disabled:opacity-40"
      >
        이전
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onChangePage(page)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            page === currentPage
              ? "bg-slate-900 text-white"
              : "border border-slate-300 bg-white text-slate-800"
          }`}
        >
          {page + 1}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages - 1}
        onClick={() => onChangePage(currentPage + 1)}
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 disabled:opacity-40"
      >
        다음
      </button>
    </div>
  );
}

export default Pagination;
