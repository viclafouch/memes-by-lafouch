/* eslint-disable consistent-return */
'use server'

import { revalidatePath } from 'next/cache'
import { redirect, RedirectType } from 'next/navigation'
import { z } from 'zod'
import prisma from '@/db'
import type { SimpleFormState } from '@/serverActions/types'
import { utapi } from '@/uploadthing'
import { client } from '@/utils/algolia'
import { matchIsLoggedIn } from '@/utils/auth'
import type { Meme } from '@prisma/client'

const schema = z.string()

export type DeleteMemeFormState = SimpleFormState<{ meme: Meme }, typeof schema>

export async function deleteMeme(
  prevState: DeleteMemeFormState,
  formData: FormData
): Promise<DeleteMemeFormState> {
  const isLoggedIn = await matchIsLoggedIn()

  try {
    if (!isLoggedIn) {
      throw new Error('You must be logged in to delete a meme')
    }

    const memeId = schema.parse(formData.get('id'))

    const meme = await prisma.meme.delete({
      where: {
        id: memeId
      },
      include: {
        video: true
      }
    })

    await prisma.video.delete({
      where: {
        id: meme.videoId
      }
    })

    const deleteFilesResult = await utapi.deleteFiles(
      meme.video.posterUtKey
        ? [meme.video.posterUtKey, meme.video.videoUtKey]
        : meme.video.videoUtKey
    )

    await client.deleteObject({
      indexName: 'memes',
      objectID: meme.id
    })

    if (!deleteFilesResult.success) {
      return await Promise.reject(new Error('Failed to delete file'))
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)

    return {
      status: 'error',
      errorMessage:
        error instanceof Error ? error.message : 'An unknown error occurred',
      formErrors: null
    }
  }

  revalidatePath('/library', 'page')
  redirect('/library', RedirectType.replace)
}
