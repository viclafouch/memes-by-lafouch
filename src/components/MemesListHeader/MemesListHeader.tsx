import React from 'react'
import MemesOrderBy from '@/components/Filters/MemesOrderBy'
import MemesQuery from '@/components/Filters/MemesQuery'
import { SearchMemesResponse } from '@/utils/algolia'
import { Button, Skeleton } from '@heroui/react'
import { ShuffleSimple } from '@phosphor-icons/react/dist/ssr'

export type MemesListHeaderProps =
  | {
      getPromiseMemes: SearchMemesResponse
      isLoading?: never
    }
  | {
      isLoading: true
      getPromiseMemes?: never
    }

const MemesListHeader = ({
  getPromiseMemes,
  isLoading
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
            <span className="mt-1 text-lg font-semibold">
              {React.use(getPromiseMemes).memeTotalCount} mèmes au total
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {isLoading ? (
            <Skeleton className="grow md:grow-0 h-unit-10 rounded-full" />
          ) : (
            <Button
              color="secondary"
              href="/random"
              as="a"
              className="rounded-full"
              endContent={<ShuffleSimple size={20} />}
            >
              Aléatoire
            </Button>
          )}
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
        <MemesQuery />
      )}
    </header>
  )
}

export default MemesListHeader
