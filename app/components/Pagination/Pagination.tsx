import React from 'react'

export type PaginationProps = {
  totalPages: number
  currentPage: number
  renderItems: (
    type: 'previous' | 'next' | 'page' | 'dots',
    page: number
  ) => React.ReactNode
}

const Pagination = ({
  totalPages,
  currentPage,
  renderItems
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | '...')[] = []

    if (totalPages <= 7) {
      for (let index = 1; index <= totalPages; index += 1) {
        pages.push(index)
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        )
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        )
      }
    }

    return pages
  }

  const pages = getPageNumbers()

  return (
    <div className="join">
      {currentPage > 1 ? renderItems('previous', currentPage - 1) : null}
      {pages.map((page, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={`${index}-${page}`}>
            {renderItems(
              page === '...' ? 'dots' : 'page',
              page === '...' ? -1 : page
            )}
          </React.Fragment>
        )
      })}
      {currentPage < totalPages ? renderItems('next', currentPage + 1) : null}
    </div>
  )
}

export default Pagination
