import React from "react";
import { usePageContext } from "./PageContext";

const PageList = () => {
  const { currentPage, setCurrentPage } = usePageContext();
  const pages = Array.from({ length: 604 }, (_, i) => i + 1);

  return (
    <div className="page-list">
      {pages.map((page) => (
        <div
          key={page}
          className={`page-number ${page === currentPage ? "active" : ""}`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </div>
      ))}
    </div>
  );
};

export default PageList;
