/* eslint-disable consistent-return */
'use server'

import { redirect, RedirectType } from 'next/navigation'
import { z } from 'zod'
import prisma from '@/db'
import { SimpleFormState } from '@/serverActions/types'
import { utapi } from '@/uploadthing'
import { Meme } from '@prisma/client'

const schema = z.string()

export type DeleteMemeFormState = SimpleFormState<{ meme: Meme }, typeof schema>

export async function deleteMeme(
  prevState: DeleteMemeFormState,
  formData: FormData
): Promise<DeleteMemeFormState> {
  try {
    const memeId = schema.parse(formData.get('id'))

    const meme = await prisma.meme.delete({
      where: {
        id: memeId
      }
    })

    const deleteFileResult = await utapi.deleteFiles(meme.videoKey)

    if (!deleteFileResult.success) {
      return await Promise.reject(new Error('Failed to delete file'))
    }
  } catch (error: unknown) {
    return {
      status: 'error',
      errorMessage:
        error instanceof Error ? error.message : 'An unknown error occurred',
      formErrors: null
    }
  }

  redirect('/library', RedirectType.replace)
}