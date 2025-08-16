import React from 'react'
import { Paginator } from '@/components/paginator'

type MemesPaginationProps = {
  currentPage: number
  totalPages: number
}

const MemesPagination = ({ currentPage, totalPages }: MemesPaginationProps) => {
  return (
    <Paginator
      currentPage={currentPage}
      totalPages={totalPages}
      getLinkProps={(page) => {
        return {
          to: '/memes',
          search: (prevState) => {
            return {
              page,
              query: prevState.query,
              orderBy: prevState.orderBy
            }
          }
        }
      }}
      showPreviousNext
    />
  )
}

export default MemesPagination
