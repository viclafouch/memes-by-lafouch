'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/db'
import { Meme } from '@prisma/client'

export async function incrementDownloadCount(memeId: Meme['id']) {
  await prisma.meme.update({
    where: {
      id: memeId
    },
    data: {
      downloadCount: {
        increment: 1
      }
    }
  })

  revalidatePath(`/library/${memeId}`, 'page')

  return { success: true }
}
