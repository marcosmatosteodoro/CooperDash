'use client'

import React from 'react';
import Link from 'next/link';
import type {BreadcrumbItemInterface} from "@/types/ui";

export const BreadcrumbItem: React.FC<BreadcrumbItemInterface>  = ({breadcrumb, isLast, isFirst}) => {
  const className = `breadcrumb-item ${isLast ? 'active' : ''}`
  const ariaCurrent = isLast ? 'page' : undefined
  
  return (
    <li className={className} aria-current={ariaCurrent} >
      {isLast ? (
        breadcrumb.label
      ) : (
        <Link href={breadcrumb?.path || '#'} className="text-decoration-none">
          {isFirst && <i className="bi bi-house-fill me-1"></i>}
          {breadcrumb.label}
        </Link>
      )}
    </li>
  )
}