import React from 'react'
import MemesOrderBy from '@/components/Filters/MemesOrderBy'
import MemesSearch from '@/components/Filters/MemesQuery'
import prisma from '@/db'

const MemesListHeader = async () => {
  const memesCount = await prisma.meme.count()

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-large font-semibold">{memesCount} mème(s)</h1>
      <MemesOrderBy />
      <MemesSearch />
    </header>
  )
}

export default MemesListHeader
