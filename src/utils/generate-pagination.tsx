import type { JSX } from 'react'
import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from '@/components/ui/pagination'

export const generatePaginationLinks = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
) => {
  const pages: JSX.Element[] = []

  if (totalPages <= 6) {
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
  } else {
    for (let index = 1; index <= 2; index += 1) {
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

    if (currentPage > 2 && currentPage < totalPages - 1) {
      pages.push(<PaginationEllipsis key="start-ellipsis" />)
      pages.push(
        <PaginationItem key={`current-${currentPage}`}>
          <PaginationLink
            onClick={() => {
              return onPageChange(currentPage)
            }}
            isActive
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
      )
    }

    pages.push(<PaginationEllipsis key="end-ellipsis" />)

    for (let index = totalPages - 1; index <= totalPages; index += 1) {
      pages.push(
        <PaginationItem key={`end-${index}`}>
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
  }

  return pages
}
