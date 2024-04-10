'use client'

import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/utils/cn'
import {
  Pagination,
  PaginationItemRenderProps,
  PaginationItemType
} from '@nextui-org/react'

export type MemesListPaginationProps = {
  currentPage: number
  nbPages: number
}

const MemesListPagination = ({
  nbPages,
  currentPage
}: MemesListPaginationProps) => {
  const searchParams = useSearchParams()

  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    page,
    className
  }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          type="button"
          className={cn(className, 'bg-default-200/50 min-w-8 w-8 h-8')}
        >
          Suiv.
        </button>
      )
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          type="button"
          className={cn(className, 'bg-default-200/50 min-w-8 w-8 h-8')}
        >
          Préc.
        </button>
      )
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button type="button" key={key} className={className}>
          ...
        </button>
      )
    }

    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('page', String(page))

    return (
      <Link
        key={key}
        ref={ref}
        href={`?${newSearchParams.toString()}`}
        className={cn(
          className,
          isActive &&
            'text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold'
        )}
      >
        {value}
      </Link>
    )
  }

  return (
    <Pagination
      total={nbPages}
      page={currentPage + 1}
      renderItem={renderItem}
    />
  )
}

export default MemesListPagination
