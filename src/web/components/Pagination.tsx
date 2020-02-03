import React from "react";

export default function Pagination({
  totalItems,
  pageSize,
  updatePage,
  currentPage,
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize)
  );
  return (
    <>
      {[...Array(totalPages)].map((e, i) => (
        <React.Fragment key={i}>
          {i + 1 > 1 && i + 2 === currentPage - 1 && (
            <a className="pagination-circle elipsis">...</a>
          )}
          <a
            onClick={() =>
              updatePage(i)
            }
            className="pagination-circle"
            data-current-page={currentPage === i + 1}
            data-first-last-page={i + 1 === 1 || i + 1 === totalPages}
            data-visible={
              i + 1 === currentPage - 1 ||
              i + 1 === currentPage ||
              i + 1 === currentPage + 1
            }
          >
            {i + 1}
          </a>
          {i + 1 < totalPages && i === currentPage + 1 && (
            <a className="pagination-circle elipsis">...</a>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
