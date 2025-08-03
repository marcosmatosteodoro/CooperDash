export type BreadcrumbType = {
  label: string;
  path?: string;
}

export interface BreadcrumbItemInterface {
  breadcrumb: BreadcrumbType
  isLast: boolean
  isFirst: boolean
}

export interface BreadcrumbsInterface {
  breadcrumbs: BreadcrumbType[]
}

