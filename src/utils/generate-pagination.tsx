import type { JSX } from 'react'
import { PaginationItem, PaginationLink } from '@/components/ui/pagination'

export const generatePaginationLinks = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
): JSX.Element[] => {
  const pages: JSX.Element[] = []
  const maxVisible = 6

  if (totalPages <= maxVisible) {
    for (let index = 1; index <= totalPages; index += 1) {
      pages.push(
        <PaginationItem key={index}>
          <PaginationLink
            onClick={() => {
              return onPageChange(index)
            }}
            isActive={index === currentPage}
          >
            {index}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return pages
  }

  const halfVisible = Math.floor(maxVisible / 2)
  let startPage = Math.max(1, currentPage - halfVisible)
  const endPage = Math.min(totalPages, startPage + maxVisible - 1)

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let index = startPage; index <= endPage; index += 1) {
    pages.push(
      <PaginationItem key={index}>
        <PaginationLink
          onClick={() => {
            return onPageChange(index)
          }}
          isActive={index === currentPage}
        >
          {index}
        </PaginationLink>
      </PaginationItem>
    )
  }

  return pages
}
