import React from 'react'
import { MemeListItem } from '@/components/Meme/meme-list-item'
import { Paginator } from '@/components/paginator'
import type { MemesFilters } from '@/constants/meme'
import { getMemesListQueryOpts } from '@/lib/queries'
import { useSuspenseQuery } from '@tanstack/react-query'

export type MemesListProps = {
  filters: MemesFilters
  onPageChange: (page: MemesFilters['page']) => void
}

export const MemesList = ({ onPageChange, filters }: MemesListProps) => {
  const { data } = useSuspenseQuery(getMemesListQueryOpts(filters))
  const { memes, totalPages, currentPage, query } = data

  if (memes.length === 0) {
    return (
      <p className="text-muted-foreground">
        Aucun résultat pour `<i>{query}</i>`
      </p>
    )
  }

  return (
    <div className="w-full flex flex-col gap-y-12">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {memes.map((meme) => {
          return <MemeListItem key={meme.id} meme={meme} />
        })}
      </div>
      <div className="flex justify-end">
        <Paginator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showPreviousNext
        />
      </div>
    </div>
  )
}
