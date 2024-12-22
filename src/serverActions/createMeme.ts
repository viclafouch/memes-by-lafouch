/* eslint-disable consistent-return */
'use server'

import { revalidatePath } from 'next/cache'
import { redirect, RedirectType } from 'next/navigation'
import { z } from 'zod'
import {
  MAX_SIZE_MEME_IN_BYTES,
  type MemeWithVideo,
  TWITTER_LINK_SCHEMA
} from '@/constants/meme'
import prisma from '@/db'
import type { SimpleFormState } from '@/serverActions/types'
import { utapi } from '@/uploadthing'
import { indexMemeObject } from '@/utils/algolia'
import { matchIsLoggedIn } from '@/utils/auth'
import { getFileExtension } from '@/utils/file'

const schema = z.object({
  title: z.string().min(3).trim(),
  tweet: TWITTER_LINK_SCHEMA.optional(),
  video: z
    // Need Node >= v20
    // See https://github.com/colinhacks/zod/issues/387#issuecomment-1774603011
    .instanceof(File)
    .refine(
      (file) => {
        return file.size > 0
      },
      {
        message: 'Video file is required'
      }
    )
    .refine(
      (file) => {
        const sizeInBytes = Math.round(file.size / 1024)

        return sizeInBytes < MAX_SIZE_MEME_IN_BYTES
      },
      {
        message: 'Video file size must not exceed 16 MB'
      }
    )
    .refine(
      (file) => {
        const extension = getFileExtension(file)

        return extension === 'mp4'
      },
      {
        message: 'Video format must be .mp4'
      }
    )
})

export type CreateMemeFormState = SimpleFormState<unknown, typeof schema>

export async function createMeme(
  prevState: CreateMemeFormState,
  formData: FormData
): Promise<CreateMemeFormState> {
  let meme: MemeWithVideo

  const isLoggedIn = await matchIsLoggedIn()

  if (!isLoggedIn) {
    return {
      status: 'error',
      errorMessage: 'You must be logged in to create a meme',
      formErrors: null
    }
  }

  try {
    const validatedFields = await schema.safeParseAsync({
      title: formData.get('title'),
      video: formData.get('video'),
      tweet: formData.get('tweetUrl') || undefined
    })

    if (!validatedFields.success) {
      return {
        formErrors: validatedFields.error.flatten(),
        errorMessage: '',
        status: 'error'
      }
    }

    const { tweet } = validatedFields.data

    if (formData.get('tweetUrl') && !tweet) {
      return {
        status: 'error',
        formErrors: null,
        errorMessage: 'Tweet not exist or does not include a video'
      }
    }

    const uploadFileResult = await utapi.uploadFiles(validatedFields.data.video)

    if (uploadFileResult.error) {
      // eslint-disable-next-line no-console
      console.error(uploadFileResult.error)

      return {
        formErrors: null,
        errorMessage: "Le fichier n'a pas pu être uploadé",
        status: 'error'
      }
    }

    meme = await prisma.meme.create({
      data: {
        title: validatedFields.data.title,
        tweetUrl: tweet?.url,
        video: {
          create: {
            videoUtKey: uploadFileResult.data.key,
            src: uploadFileResult.data.url,
            poster: ''
          }
        }
      },
      include: {
        video: true
      }
    })

    await indexMemeObject(meme)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)

    return {
      status: 'error',
      errorMessage: 'An unknown error occurred',
      formErrors: null
    }
  }

  revalidatePath('/library', 'page')
  redirect(`/library/${meme.id}`, RedirectType.push)
}
