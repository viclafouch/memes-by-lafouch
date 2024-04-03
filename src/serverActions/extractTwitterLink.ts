/* eslint-disable consistent-return */
'use server'

import { revalidatePath } from 'next/cache'
import { redirect, RedirectType } from 'next/navigation'
import { filesize } from 'filesize'
import { UTFile } from 'uploadthing/server'
import { z } from 'zod'
import { MAX_SIZE_MEME_IN_BYTES, TWITTER_LINK_SCHEMA } from '@/constants/meme'
import prisma from '@/db'
import { SimpleFormState } from '@/serverActions/types'
import { utapi } from '@/uploadthing'
import { withTimeout } from '@/utils/promise'
import { Meme } from '@prisma/client'

const tweetbinderSchema = z.object({
  statusId: z.coerce.number(),
  url: z.string(),
  videos: z.array(
    z.object({
      bitrate: z.coerce.number(),
      endpoint: z.string(),
      quality: z.string().transform((value) => {
        return value.replace('avc1/', '')
      }),
      size: z.coerce.number(),
      type: z.string(),
      url: z.string()
    })
  )
})

const schema = TWITTER_LINK_SCHEMA

export type ExtractTwitterFormState = SimpleFormState<
  { meme: Meme },
  typeof schema
>

export async function extractTwitterLink(
  prevState: ExtractTwitterFormState,
  formData: FormData
): Promise<ExtractTwitterFormState> {
  let memeId: Meme['id']

  try {
    const safeParsedResult = schema.safeParse(formData.get('link'))

    if (!safeParsedResult.success) {
      return {
        status: 'error',
        formErrors: null,
        errorMessage: 'URL is not a valid X link'
      }
    }

    const response = await withTimeout(
      fetch(
        `https://pub.tweetbinder.com:51026/twitter/status/${safeParsedResult.data.twitterId}`
      ),
      5000
    )

    const json = await response.json()

    const data = tweetbinderSchema.parse(json)
    const video = data.videos.at(-1)!

    const responseTwitterVideo = await fetch(video.url)
    const blob = await responseTwitterVideo.blob()

    if (blob.size > MAX_SIZE_MEME_IN_BYTES) {
      return {
        status: 'error',
        formErrors: null,
        errorMessage: `Video size is too big: ${filesize(video.size)}`
      }
    }

    const videoFile = new UTFile([blob], `${Date.now().toString()}.mp4`)

    const uploadFileResult = await utapi.uploadFiles(videoFile)

    if (uploadFileResult.error) {
      return await Promise.reject(uploadFileResult.error.message)
    }

    const meme = await prisma.meme.create({
      data: {
        title: 'Titre inconnu',
        videoUrl: uploadFileResult.data.url,
        videoKey: uploadFileResult.data.key,
        twitterUrl: safeParsedResult.data.url
      }
    })

    memeId = meme.id
  } catch (error) {
    return {
      status: 'error',
      formErrors: null,
      errorMessage: 'An unknown error occurred'
    }
  }

  revalidatePath('/library', 'page')
  redirect(`/library/${memeId}`, RedirectType.push)
}
