/* eslint-disable consistent-return */
'use server'

import { revalidatePath } from 'next/cache'
import { redirect, RedirectType } from 'next/navigation'
import { filesize } from 'filesize'
import { UTFile } from 'uploadthing/server'
import { z } from 'zod'
import { MAX_SIZE_MEME_IN_BYTES, TWITTER_URL_REGEX } from '@/constants/meme'
import prisma from '@/db'
import { SimpleFormState } from '@/serverActions/types'
import { utapi } from '@/uploadthing'
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

const schema = z.string().regex(TWITTER_URL_REGEX)

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

    const twitterLink = safeParsedResult.data
    const matchId = twitterLink.match(TWITTER_URL_REGEX) as RegExpMatchArray
    const twitterId = z.string().parse(matchId.at(2))

    const response = (await Promise.race([
      fetch(`https://pub.tweetbinder.com:51026/twitter/status/${twitterId}`),
      new Promise((resolve, reject) => {
        return setTimeout(reject, 5000)
      })
    ])) as Response

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
        twitterUrl: twitterLink
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
