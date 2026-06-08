export default function Pagination({ metadata, onPageChange }) {
  const { total_pages, current_page } = metadata;
  
  if (!total_pages || total_pages <= 1) return null;

  return (
    <div className="pagination">
      {[...Array(total_pages).keys()].map((page) => {
        const pageNum = page + 1;
        return (
          <button 
            key={pageNum} 
            onClick={() => onPageChange(pageNum)} 
            className={`page-btn ${current_page === pageNum ? "active" : ""}`}
            disabled={current_page === pageNum}
          >
            {pageNum}
          </button>
        );
      })}
    </div>
  );
}