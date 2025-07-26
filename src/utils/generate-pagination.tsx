import type { JSX } from 'react'
import { PaginationItem, PaginationLink } from '@/components/ui/pagination'

export const generatePaginationLinks = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
) => {
  const pages: JSX.Element[] = []

  for (let index = 1; index <= totalPages; index += 1) {
    pages.push(
      <PaginationItem key={`start-${index}`}>
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
