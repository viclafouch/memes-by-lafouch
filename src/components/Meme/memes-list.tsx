import React from 'react'
import MemesPagination from '@/components/Meme/Filters/memes-pagination'
import { MemeListItem } from '@/components/Meme/meme-list-item'
import type { MemesFilters } from '@/constants/meme'
import { getMemesListQueryOpts } from '@/lib/queries'
import { useDebouncedValue } from '@tanstack/react-pacer'
import { useSuspenseQuery } from '@tanstack/react-query'

export type MemesListProps = {
  query: MemesFilters['query']
  page: MemesFilters['page']
  orderBy: MemesFilters['orderBy']
}

export const MemesList = ({ query, page, orderBy }: MemesListProps) => {
  const [debouncedValue] = useDebouncedValue(query, {
    wait: 300,
    leading: false
  })

  const filters = React.useMemo(() => {
    return {
      query: debouncedValue,
      page,
      orderBy
    }
  }, [debouncedValue, page, orderBy])

  const { data } = useSuspenseQuery(getMemesListQueryOpts(filters))
  const { memes, totalPages, currentPage, query: queryFromData } = data

  if (memes.length === 0) {
    return (
      <p className="text-muted-foreground">
        Aucun résultat pour `<i>{queryFromData}</i>`
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
        <MemesPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  )
}
