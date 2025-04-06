'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/db'
import { updateMemeObject } from '@/utils/algolia'
import type { Meme } from '@prisma/client'

export async function incrementDownloadCount(memeId: Meme['id']) {
  const meme = await prisma.meme.update({
    where: {
      id: memeId
    },
    data: {
      downloadCount: {
        increment: 1
      }
    },
    select: {
      downloadCount: true
    }
  })

  await updateMemeObject(memeId, meme)

  revalidatePath(`/library/${memeId}`, 'page')

  return { success: true }
}
