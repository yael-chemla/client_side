// export default function Pagination({ metadata, onPageChange }) {
//   const { total_pages, current_page } = metadata;
  
//   if (!total_pages || total_pages <= 1) return null;

//   return (
//     <div className="pagination">
//       {[...Array(total_pages).keys()].map((page) => {
//         const pageNum = page + 1;
//         return (
//           <button 
//             key={pageNum} 
//             onClick={() => onPageChange(pageNum)} 
//             className={`page-btn ${current_page === pageNum ? "active" : ""}`}
//             disabled={current_page === pageNum}
//           >
//             {pageNum}
//           </button>
//         );
//       })}
//     </div>
//   );
// }
export default function Pagination({ metadata, onPageChange }) {
    const { total_pages, current_page } = metadata;

    if (!total_pages || total_pages <= 1) return null;

    const getPageNumbers = () => {
        if (current_page === 1) return [1, 2];
        if (current_page === total_pages) return [total_pages - 1, total_pages];
        return [current_page - 1, current_page];
    };

    return (
        <div className="pagination">
            <button
                className="page-btn"
                onClick={() => onPageChange(current_page - 1)}
                disabled={current_page === 1}
            >
                →
            </button>

            {getPageNumbers().map((pageNum) => (
                <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`page-btn ${current_page === pageNum ? "active" : ""}`}
                    disabled={current_page === pageNum}
                >
                    {pageNum}
                </button>
            ))}

            <button
                className="page-btn"
                onClick={() => onPageChange(current_page + 1)}
                disabled={current_page === total_pages}
            >
                ←
            </button>
        </div>
    );
}