'use client'

import { PaginationInterface } from "../types"

export const Pagination = ({
    links,
    current_page,
    last_page,
    total,
    paginationClickHandler
  }: PaginationInterface) =>  {

  const onClickHandler = (url: string | null) => {
    if (url) {
      paginationClickHandler(url);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 p-3">
      <nav aria-label="...">
        <ul className="pagination">
          {links.map((link, index) => (
            <li key={index} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
              <button
                className="page-link" 
                dangerouslySetInnerHTML={{ __html: link.label }}
                onClick={() => onClickHandler(link.url)}
              />
            </li>
          ))}
        </ul>
      </nav>

      <span>Showing {current_page} to {last_page} of {total} Entries</span>
    </div>
  );
}