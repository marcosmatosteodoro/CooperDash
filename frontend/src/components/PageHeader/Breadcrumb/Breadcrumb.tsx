'use client'

import React from 'react';
import {BreadcrumbsInterface, BreadcrumbType, BreadcrumbItem} from '../'

export const Breadcrumb: React.FC<BreadcrumbsInterface> = ({breadcrumbs}) => (
  <nav aria-label="breadcrumb">
    <ol className="breadcrumb mb-2 mb-md-0">
      {breadcrumbs.map((breadcrumb: BreadcrumbType, index: number) => 
        <BreadcrumbItem
          key={index}
          breadcrumb={breadcrumb}
          isLast={index === breadcrumbs.length - 1}
          isFirst={index === 0} 
        />
      )}
    </ol>
  </nav>
);