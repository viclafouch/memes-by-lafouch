import React from 'react'
import MemesToggleGrid from '@/components/Meme/Filters/memes-toggle-grid'
import { MotionLink } from '@/components/motion-link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/spinner'
import { getMemes } from '@/server/meme'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'

export const StudioMemes = ({
  columnGridCount,
  onColumnValueChange
}: {
  columnGridCount: number
  onColumnValueChange: (value: number) => void
}) => {
  const { memeId } = useParams({ strict: false })

  const memesInfinityQuery = useInfiniteQuery({
    queryKey: ['memes'],
    queryFn: ({ pageParam }) => {
      return getMemes({
        data: {
          page: pageParam,
          orderBy: 'most_recent'
        }
      })
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage
    }
  })

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center w-full justify-between gap-4">
        <Input placeholder="Rechercher un meme" />
        <MemesToggleGrid
          columnValue={columnGridCount}
          values={[1, 2, 3]}
          onColumnValueChange={onColumnValueChange}
        />
      </div>
      <div className="overflow-scroll">
        <div
          className="w-full grid grid-cols-2 gap-2 sm:[grid-template-columns:var(--cols)] flex-1 overflow-scroll"
          style={
            {
              '--cols': `repeat(${columnGridCount}, 1fr)`
            } as React.CSSProperties
          }
        >
          {memesInfinityQuery.data?.pages.map((group, index) => {
            const { memes } = group

            return (
              // eslint-disable-next-line react/no-array-index-key
              <React.Fragment key={index}>
                {memes.map((meme) => {
                  return (
                    <MotionLink
                      className="group bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm border border-white/10 aria-selected:bg-primary/50"
                      to="/studio/$memeId"
                      layout
                      params={{ memeId: meme.id }}
                      key={meme.id}
                      aria-selected={meme.id === memeId}
                    >
                      <div className="relative w-full h-full">
                        <img
                          src={`https://vz-eb732fb9-3bc.b-cdn.net/${meme.video.bunnyId}/thumbnail.jpg`}
                          alt={meme.title}
                          className="absolute w-full h-full inset-0 object-cover"
                        />
                        <img
                          src={`https://vz-eb732fb9-3bc.b-cdn.net/${meme.video.bunnyId}/preview.webp`}
                          alt={meme.title}
                          className="absolute w-full h-full inset-0 hidden duration-600 group-hover:block transition-discrete z-10 object-cover opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-focus-within:block"
                        />
                        <span className="absolute inset-0 md:opacity-0 group-hover:opacity-100 text-white/80 place-items-center bg-muted/60 text-center p-2 text-balance flex justify-center items-center z-20">
                          {meme.title}
                        </span>
                      </div>
                    </MotionLink>
                  )
                })}
              </React.Fragment>
            )
          })}
        </div>
        {memesInfinityQuery.hasNextPage && !memesInfinityQuery.isPending ? (
          <div className="w-full flex justify-center py-2">
            <Button
              variant="outline"
              onClick={(event) => {
                event.preventDefault()

                return memesInfinityQuery.fetchNextPage()
              }}
            >
              Afficher plus
            </Button>
          </div>
        ) : null}
        {memesInfinityQuery.isPending ? (
          <div className="w-full flex justify-center py-4">
            <LoadingSpinner />
          </div>
        ) : null}
      </div>
    </div>
  )
}
