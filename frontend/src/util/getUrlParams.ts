import { PaginationParams } from "@/types/api";

export const getUrlParams = (params: PaginationParams): string => {
  if(!params) {
    return ''
  }

  params = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null)
  );

  return '?' + new URLSearchParams(params as Record<string, string>).toString()
}