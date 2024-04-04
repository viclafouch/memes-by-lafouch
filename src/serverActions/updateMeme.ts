'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TWITTER_LINK_SCHEMA } from '@/constants/meme'
import prisma from '@/db'
import { SimpleFormState } from '@/serverActions/types'

const schema = z.object({
  title: z.string().min(3),
  memeId: z.string(),
  tweetUrl: TWITTER_LINK_SCHEMA.optional()
})

export type UpdateMemeFormState = SimpleFormState<unknown, typeof schema>

export async function updateMeme(
  prevState: UpdateMemeFormState,
  formData: FormData
): Promise<UpdateMemeFormState> {
  try {
    const validatedFields = schema.safeParse({
      title: formData.get('title'),
      memeId: formData.get('id'),
      tweetUrl: formData.get('tweetUrl') || undefined
    })

    if (!validatedFields.success) {
      return {
        formErrors: validatedFields.error.flatten(),
        errorMessage: '',
        status: 'error'
      }
    }

    if (validatedFields.data.tweetUrl) {
      const existedMeme = await prisma.meme.findFirst({
        where: {
          tweetUrl: validatedFields.data.tweetUrl.url,
          id: {
            not: validatedFields.data.memeId
          }
        }
      })

      if (existedMeme) {
        return {
          formErrors: null,
          errorMessage: 'Un mème avec ce lien Twitter existe déjà !',
          status: 'error'
        }
      }
    }

    await prisma.meme.update({
      where: {
        id: validatedFields.data.memeId
      },
      data: {
        title: validatedFields.data.title,
        tweetUrl: validatedFields.data.tweetUrl?.url ?? null
      }
    })

    revalidatePath(`/library/${validatedFields.data.memeId}`, 'page')

    return {
      status: 'success'
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)

    return {
      status: 'error',
      errorMessage: 'An unknown error occurred',
      formErrors: null
    }
  }
}
