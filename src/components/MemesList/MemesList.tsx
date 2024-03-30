import React from 'react'
import MemeListItem from '@/components/MemeListItem'
import { MemeFilters } from '@/constants/meme'
import prisma from '@/db'

export type MemesListProps = {
  filters: MemeFilters
}

async function getMemes({ filters }: MemesListProps) {
  await new Promise((resolve) => {
    return setTimeout(resolve, 1000)
  })

  return prisma.meme.findMany({
    orderBy: {
      createdAt: filters.orderBy === 'most_old' ? 'asc' : 'desc'
    }
  })
}

const MemesList = async ({ filters }: MemesListProps) => {
  const [memes] = await Promise.all([
    getMemes({ filters }),
    new Promise((resolve) => {
      return setTimeout(resolve, 1000)
    })
  ])

  return (
    <div className="py-4 grid w-full gap-5 md:grid-cols-3 lg:grid-cols-4">
      {memes.map((meme) => {
        return <MemeListItem key={meme.id} meme={meme} />
      })}
    </div>
  )
}

export default MemesList
