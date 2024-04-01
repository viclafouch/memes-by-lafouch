/* eslint-disable consistent-return */
'use server'

import { revalidatePath } from 'next/cache'
import { redirect, RedirectType } from 'next/navigation'
import { UTApi } from 'uploadthing/server'
import { z } from 'zod'
import { MAX_SIZE_MEME_IN_BYTES } from '@/constants/meme'
import prisma from '@/db'
import { getFileExtension } from '@/utils/file'

const schema = z.object({
  title: z.string().min(3),
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

export type FormStateValue =
  | {
      errorMessage: string
      success: false
      formErrors: z.typeToFlattenedError<z.infer<typeof schema>> | null
    }
  | {
      success: true
    }
  | null

const utapi = new UTApi()

export async function createMeme(
  prevState: FormStateValue,
  formData: FormData
) {
  try {
    const validatedFields = schema.safeParse({
      title: formData.get('title'),
      video: formData.get('video')
    })

    if (!validatedFields.success) {
      return {
        formErrors: validatedFields.error.flatten(),
        errorMessage: '',
        success: false
      }
    }

    const response = await utapi.uploadFiles(validatedFields.data.video)

    if (response.error) {
      return await Promise.reject(response.error)
    }

    const uploadedVideo = response.data

    await prisma.meme.create({
      data: {
        title: validatedFields.data.title,
        videoUrl: uploadedVideo.url
      }
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)

    return {
      success: false,
      errorMessage: 'An unknown error occurred',
      formErrors: null
    }
  }

  revalidatePath('/library', 'page')
  redirect('/library', RedirectType.push)
}
