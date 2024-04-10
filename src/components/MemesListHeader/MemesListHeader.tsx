import React from 'react'
import MemesOrderBy from '@/components/Filters/MemesOrderBy'
import MemesQuery from '@/components/Filters/MemesQuery'
import { MemeFilters } from '@/constants/meme'
import { SearchMemesResponse } from '@/utils/algolia'
import { Skeleton } from '@nextui-org/react'

export type MemesListHeaderProps =
  | {
      getPromiseMemes: SearchMemesResponse
      filters: MemeFilters
      isLoading?: never
    }
  | {
      isLoading: true
      filters?: never
      getPromiseMemes?: never
    }

const MemesListHeader = ({
  getPromiseMemes,
  isLoading,
  filters
}: MemesListHeaderProps) => {
  return (
    <header className="flex flex-col gap-4">
      <div className="flex justify-between flex-col md:flex-row items-center gap-4">
        {isLoading ? (
          <Skeleton className="w-2/6 rounded-lg">
            <div className="w-full text-large">
              <span className="bg-default-200">{'\u00A0'}</span>
            </div>
          </Skeleton>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-large font-semibold">
              {React.use(getPromiseMemes).memes.length} mèmes
            </h1>
            {' / '}
            <span className="mt-1 text-tiny font-semibold">
              {' '}
              {React.use(getPromiseMemes).memeTotalCount} au total
            </span>
          </div>
        )}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="grow md:grow-0 shrink-0 md:w-40">
            {isLoading ? (
              <Skeleton className="grow md:grow-0 h-unit-10 rounded-full" />
            ) : (
              <MemesOrderBy />
            )}
          </div>
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="w-full h-unit-12 rounded-full" />
      ) : (
        <MemesQuery value={filters.query} />
      )}
    </header>
  )
}

export default MemesListHeader
