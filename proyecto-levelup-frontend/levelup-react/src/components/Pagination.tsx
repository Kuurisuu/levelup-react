interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({
  current,
  total,
  onChange,
}: PaginationProps) {
  if (total <= 1) return null;

  const pages = [];
  for (let i = 1; i <= total; i++) pages.push(i);

  return (
    <nav className="pagination" aria-label="Paginación de productos">
      <button
        className="page-btn"
        onClick={() => onChange(Math.max(1, current - 1))}
        aria-label="Página anterior"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`page-btn ${p === current ? "active" : ""}`}
          onClick={() => onChange(p)}
          aria-current={p === current ? "page" : undefined}
        >
          {p}
        </button>
      ))}
      <button
        className="page-btn"
        onClick={() => onChange(Math.min(total, current + 1))}
        aria-label="Página siguiente"
      >
        ›
      </button>
    </nav>
  );
}
