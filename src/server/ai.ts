import { cosineSimilarity } from 'ai'
import OpenAI from 'openai'
import * as R from 'remeda'
import { z } from 'zod'
import { prismaClient } from '@/db'
import { createServerFn } from '@tanstack/react-start'

const openai = new OpenAI()

async function embed(text: string) {
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: text,
    // eslint-disable-next-line camelcase
    encoding_format: 'float'
  })

  return data[0].embedding
}

export const getBestMemes = createServerFn({ method: 'GET' })
  .validator((data) => {
    return z.string().parse(data)
  })
  .handler(async ({ data: query }) => {
    const dataQueryNormalized = query.toLowerCase().trim() ?? ''

    const memes = await prismaClient.meme.findMany({
      include: {
        video: true,
        embedding: true
      }
    })

    const promptEmbedding = await embed(dataQueryNormalized)

    return R.pipe(
      memes,
      R.map((meme) => {
        const embedding = meme.embedding.at(0)

        return {
          ...meme,
          score: embedding
            ? cosineSimilarity(promptEmbedding, embedding.vector)
            : 0
        }
      }),
      R.filter((meme) => {
        return meme.score > 0.4
      }),
      R.sortBy((meme) => {
        return meme.score
      }),
      R.take(5)
    )
  })
