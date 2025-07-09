import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { generatePaginationLinks } from '@/utils/generate-pagination'

export type PaginatorProps = {
  currentPage: number
  totalPages: number
  onPageChange: (pageNumber: number) => void
  showPreviousNext: boolean
}

export const Paginator = ({
  currentPage,
  totalPages,
  onPageChange,
  showPreviousNext
}: PaginatorProps) => {
  return (
    <Pagination>
      <PaginationContent>
        {showPreviousNext && totalPages && currentPage - 1 >= 1 ? (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                return onPageChange(currentPage - 1)
              }}
            />
          </PaginationItem>
        ) : null}
        {generatePaginationLinks(currentPage, totalPages, onPageChange)}
        {showPreviousNext && totalPages && currentPage + 1 <= totalPages ? (
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                return onPageChange(currentPage + 1)
              }}
            />
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  )
}
