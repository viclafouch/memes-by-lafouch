import React from 'react'
import MemesOrderBy from '@/components/Filters/MemesOrderBy'
import MemesSearch from '@/components/Filters/MemesQuery'
import { MemeFilters } from '@/constants/meme'
import prisma from '@/db'

export type MemesListHeaderProps = {
  filters: MemeFilters
}

const MemesListHeader = async ({ filters }: MemesListHeaderProps) => {
  const memesCount = await prisma.meme.count()

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-large font-semibold">{memesCount} mème(s)</h1>
      <MemesOrderBy value={filters.orderBy} />
      <MemesSearch value={filters.query} />
    </header>
  )
}

export default MemesListHeader
