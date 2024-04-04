import React from 'react'
import MemeListItem from '@/components/MemeListItem'
import { MemeFilters } from '@/constants/meme'
import prisma from '@/db'
import { cn } from '@/utils/cn'

export type MemesListProps =
  | {
      filters: MemeFilters
      isLoading?: never
    }
  | {
      isLoading: true
      filters?: never
    }

async function getMemes(filters: MemeFilters) {
  return prisma.meme.findMany({
    orderBy: {
      createdAt: filters.orderBy === 'most_old' ? 'asc' : 'desc'
    },
    include: {
      video: true
    }
  })
}

const WrapperList = ({
  className,
  ...restPropsDiv
}: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'py-4 grid w-full gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        className
      )}
      {...restPropsDiv}
    />
  )
}

const skeletons = [1, 2, 3, 4, 5, 6, 7, 8] as const

const MemesList = async ({ filters, isLoading }: MemesListProps) => {
  if (isLoading) {
    return (
      <WrapperList>
        {skeletons.map((skeletonId) => {
          return <MemeListItem key={skeletonId} isLoading />
        })}
      </WrapperList>
    )
  }

  const memes = await getMemes(filters)

  return (
    <WrapperList>
      {memes.map((meme) => {
        return <MemeListItem key={meme.id} meme={meme} />
      })}
    </WrapperList>
  )
}

export default MemesList
