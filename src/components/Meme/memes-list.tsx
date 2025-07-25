import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MemesPagination from '@/components/Meme/Filters/memes-pagination'
import { MemeListItem } from '@/components/Meme/meme-list-item'
import type { MemesFilters, MemeWithVideo } from '@/constants/meme'
import { getMemesListQueryOpts } from '@/lib/queries'
import { useDebouncedValue } from '@tanstack/react-pacer'
import { useSuspenseQuery } from '@tanstack/react-query'

export type MemesListProps = {
  query: MemesFilters['query']
  page: MemesFilters['page']
  orderBy: MemesFilters['orderBy']
}

export const MemesList = ({ query, page, orderBy }: MemesListProps) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

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

  const handleSelect = (meme: MemeWithVideo) => {
    setSelectedId(meme.id)
  }

  const selectedMeme = memes.find((meme) => {
    return meme.id === selectedId
  })

  return (
    <div className="w-full flex flex-col gap-y-12">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {memes.map((meme) => {
          return (
            <MemeListItem
              onPlayClick={handleSelect}
              key={meme.id}
              meme={meme}
            />
          )
        })}
      </div>
      <div className="flex justify-end z-0">
        <MemesPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
      <AnimatePresence>
        {selectedMeme ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-hidden"
            onClick={() => {
              return setSelectedId(null)
            }}
          >
            <motion.div
              layoutId={`item-${selectedId}`}
              className="relative w-[800px] max-w-[90vw] aspect-video"
              onClick={(event) => {
                return event.stopPropagation()
              }}
            >
              <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm border border-white/10">
                <iframe
                  src={`https://iframe.mediadelivery.net/embed/471900/${selectedMeme.video.bunnyId}`}
                  loading="lazy"
                  title={selectedMeme.title}
                  className="w-full h-full"
                  sandbox="allow-scripts"
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
