import React from 'react'
import MemesOrderBy from '@/components/Filters/MemesOrderBy'
import MemesQuery from '@/components/Filters/MemesQuery'
import { MemeWithVideo } from '@/constants/meme'

export type MemesListHeaderProps = {
  getPromiseMemes: Promise<MemeWithVideo[]>
}

const MemesListHeader = ({ getPromiseMemes }: MemesListHeaderProps) => {
  const memes = React.use(getPromiseMemes)

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-large font-semibold">{memes.length} mème(s)</h1>
      <MemesOrderBy />
      <MemesQuery />
    </header>
  )
}

export default MemesListHeader
