'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import prisma from '@/db'
import { FormStateValue } from '@/serverActions/createMeme'

const schema = z.object({
  title: z.string().min(3),
  memeId: z.string()
})

export async function updateMeme(
  prevState: FormStateValue,
  formData: FormData
): Promise<FormStateValue> {
  try {
    const validatedFields = schema.safeParse({
      title: formData.get('title'),
      memeId: formData.get('id')
    })

    if (!validatedFields.success) {
      return {
        formErrors: validatedFields.error.flatten(),
        errorMessage: '',
        success: false
      }
    }

    await prisma.meme.update({
      where: {
        id: validatedFields.data.memeId
      },
      data: {
        title: validatedFields.data.title
      }
    })

    revalidatePath(`/library/${validatedFields.data.memeId}`, 'page')

    return {
      success: true
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)

    return {
      success: false,
      errorMessage: 'An unknown error occurred',
      formErrors: null
    }
  }
}
