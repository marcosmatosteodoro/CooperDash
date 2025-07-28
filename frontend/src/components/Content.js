'use client'

import React from 'react';
import Link from 'next/link';
import { useLayout } from '@/providers/LayoutProvider'

const Content = ({ children }) =>  {
  const { layoutData } = useLayout()
  const { breadcrumbs = [], title = '', icon = '', buttons = null } = layoutData;

  return (
    <main className="flex-grow-1 container py-4 mt-5 pt-5">
      {/* Breadcrumb e Título */}
      <div className="row align-items-center mb-4 g-3">
        <div className="col-md-8">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2 mb-md-0">
              {breadcrumbs.map((breadcrumb, index) => (
                <li 
                  key={index} 
                  className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                  aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                >
                  {index === breadcrumbs.length - 1 ? (
                    breadcrumb.label
                  ) : (
                    <Link href={breadcrumb.path} className="text-decoration-none">
                      {index === 0 && <i className="bi bi-house-fill me-1"></i>}
                      {breadcrumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          
          {title && <h1 className="h2 mt-2 mb-0">
            <i className={`bi ${icon} me-2`}></i>
            {title}
            </h1>}
        </div>
        
        {buttons && (
          <div className="col-md-4 d-flex justify-content-md-end gap-2">
            {buttons}
          </div>
        )}
      </div>

      { children }
    </main>
);
}

export default Content;