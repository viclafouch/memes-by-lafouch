import React from 'react'
import MemeListItem from '@/components/MemeListItem'
import { SearchMemesResponse } from '@/utils/algolia'
import { cn } from '@/utils/cn'

export type MemesListProps =
  | {
      getPromiseMemes: SearchMemesResponse
      isLoading?: never
    }
  | {
      isLoading: true
      getPromiseMemes?: never
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

const MemesList = ({ getPromiseMemes, isLoading }: MemesListProps) => {
  if (isLoading) {
    return (
      <WrapperList>
        {skeletons.map((skeletonId) => {
          return <MemeListItem key={skeletonId} isLoading />
        })}
      </WrapperList>
    )
  }

  const { memes } = React.use(getPromiseMemes)

  return (
    <WrapperList>
      {memes.map((meme) => {
        return <MemeListItem key={meme.id} meme={meme} />
      })}
    </WrapperList>
  )
}

export default MemesList
