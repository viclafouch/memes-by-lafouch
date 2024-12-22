'use server'

import { NODE_ENV } from '@/constants/iso-env'
import prisma from '@/db'
import { updateMemeObject } from '@/utils/algolia'
import type { Meme } from '@prisma/client'

export async function incrementViewCount(memeId: Meme['id']) {
  if (NODE_ENV !== 'production') {
    return { success: true }
  }

  const meme = await prisma.meme.update({
    where: {
      id: memeId
    },
    data: {
      viewCount: {
        increment: 1
      }
    },
    select: {
      viewCount: true
    }
  })

  await updateMemeObject(memeId, meme)

  return { success: true }
}
