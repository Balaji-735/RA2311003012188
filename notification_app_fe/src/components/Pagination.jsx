const Pagination = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="pagination-row">
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)} type="button">
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)} type="button">
        Next
      </button>
    </div>
  );
};

export default Pagination;
