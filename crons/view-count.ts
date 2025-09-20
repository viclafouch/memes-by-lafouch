/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { prismaClient } from '@/db'
import {
  algoliaClient,
  algoliaIndexName,
  memeToAlgoliaRecord
} from '@/lib/algolia'
import { getVideoPlayData } from '@/lib/bunny'

const reindexMemes = async () => {
  const memes = await prismaClient.meme.findMany({
    include: {
      video: true,
      categories: {
        include: { category: true }
      }
    }
  })

  await algoliaClient.replaceAllObjects({
    indexName: algoliaIndexName,
    objects: memes.map(memeToAlgoliaRecord)
  })
}

const task = async () => {
  const memes = await prismaClient.meme.findMany({
    include: {
      video: true
    }
  })

  console.log('Found memes', memes.length)

  for (const meme of memes) {
    const { bunnyId } = meme.video

    const { video } = await getVideoPlayData(bunnyId)

    await prismaClient.meme.update({
      where: {
        id: meme.id
      },
      data: {
        viewCount: video.views
      }
    })

    console.log(`Updated meme (${meme.id}) viewCount column to `, video.views)
  }

  console.log('Finishing refreshing algolia index')

  await reindexMemes()

  process.exit(0)
}

task()
