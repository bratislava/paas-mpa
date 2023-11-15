import { PaginationInfo } from '@/modules/backend/openapi-generated'

export const nextPageParam = (paginationInfo: PaginationInfo) => {
  return paginationInfo.currentPage * paginationInfo.pageSize < paginationInfo.total
    ? paginationInfo.currentPage + 1
    : undefined // If there is not a next page, getNextPageParam will return undefined and the hasNextPage boolean will be set to 'false'},
}
