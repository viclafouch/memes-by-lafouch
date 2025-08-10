import React from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/spinner'
import { getMemes } from '@/server/meme'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

export const StudioMemes = () => {
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
    <div className="flex flex-col gap-4">
      <div className="w-full grid grid-cols-2 gap-2">
        {memesInfinityQuery.data?.pages.map((group, index) => {
          const { memes } = group

          return (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={index}>
              {memes.map((meme) => {
                return (
                  <Link
                    className="group bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm border border-white/10"
                    to="/studio/$memeId"
                    params={{ memeId: meme.id }}
                    key={meme.id}
                  >
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
                    <span className="absolute inset-0 md:opacity-0 group-hover:opacity-100 transition-all z-20 delay-75 cursor-pointer text-white/80 place-items-center group-focus-within:opacity-100 outline-none grid bg-muted/60">
                      Sélectionner
                    </span>
                  </Link>
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
  )
}
