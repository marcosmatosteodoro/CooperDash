'use client'

import React from 'react';
import { useLayout } from '@/providers/LayoutProvider';
import { Breadcrumb } from './Breadcrumb'

export const PageHeader: React.FC = () => {
  const { layoutData } = useLayout();
  const { breadcrumbs = [], title = '', icon = '', buttons = null } = layoutData;

  return (
    <div className="row align-items-center mb-4 g-3">
      <div className="col-md-8">
        <Breadcrumb breadcrumbs={breadcrumbs} />


        {title && (
          <h1 className="h2 mt-2 mb-0">
            {icon && <i className={`bi ${icon} me-2`}></i>}
            {title}
          </h1>
        )}
      </div>

      {buttons && (
        <div className="col-md-4 d-flex justify-content-md-end gap-2">
          {buttons}
        </div>
      )}
    </div>
  );
};