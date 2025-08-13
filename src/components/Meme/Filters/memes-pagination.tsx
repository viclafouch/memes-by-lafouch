import React from 'react'
import { Paginator } from '@/components/paginator'
import type { MemesFilters } from '@/constants/meme'
import { useNavigate } from '@tanstack/react-router'

type MemesPaginationProps = {
  currentPage: number
  totalPages: number
}

const MemesPagination = ({ currentPage, totalPages }: MemesPaginationProps) => {
  const navigate = useNavigate()

  const handlePageChange = (page: MemesFilters['page']) => {
    navigate({
      to: '/memes',
      search: (prevState) => {
        return {
          page,
          query: prevState.query,
          orderBy: prevState.orderBy
        }
      },
      viewTransition: false,
      replace: true
    })
  }

  return (
    <Paginator
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      showPreviousNext
    />
  )
}

export default MemesPagination
