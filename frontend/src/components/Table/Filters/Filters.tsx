import { FilterProps } from "@/types/ui";
import React from "react";

export const Filters: React.FC<FilterProps> = ({params, paramsCleaner, placeholderFilter, searchTerm, filter, children}) => {
  const pages = [5, 10, 20, 50, 100]
  return (
    <div className="row align-items-center g-3" data-testid="filters">
      <div className="col-xl-3 col-md-4">
        <div className="input-group">
          <select 
            className="form-select" 
            value={params.per_page} 
            onChange={paramsCleaner}
            data-testid="per-page-select"
          >
            {pages.map(page => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
          <span className="input-group-text">por página</span>
        </div>
      </div>

      <div className="col-xl-9 col-md-8 mb-3 mb-md-0">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            data-testid="search-input"
            type="text"
            className="form-control"
            placeholder={placeholderFilter}
            autoFocus
            value={searchTerm}
            onChange={filter}
          />
        </div>
      </div>

      {children}
    </div>
  )
}