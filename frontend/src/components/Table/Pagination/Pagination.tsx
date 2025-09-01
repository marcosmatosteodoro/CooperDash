'use client'

import type { PaginationInterface } from "@/types/ui";

export const Pagination = ({
    links,
    current_page,
    last_page,
    total,
    params,
    setParams
  }: PaginationInterface) =>  {


  const onClickHandler = (link: string | null) => {
    if (!link) return;
    const page = new URL(link).searchParams.get('page');
    setParams({ ...params, page: page ? parseInt(page) : 1 })
  };

  return (
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 p-3">
      <nav aria-label="...">
        <ul className="pagination">
          {links && links.map((link, index) => (
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