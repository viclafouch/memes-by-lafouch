/* eslint-disable consistent-return */
'use server'

import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { redirect, RedirectType } from 'next/navigation'
import { filesize } from 'filesize'
import { MAX_SIZE_MEME_IN_BYTES, TWITTER_LINK_SCHEMA } from '@/constants/meme'
import prisma from '@/db'
import { SimpleFormState } from '@/serverActions/types'
import { utapi } from '@/uploadthing'
import { wait } from '@/utils/promise'
import { getTweetById } from '@/utils/tweet'
import { Meme } from '@prisma/client'

const schema = TWITTER_LINK_SCHEMA

export type ExtractTwitterFormState = SimpleFormState<
  { meme: Meme },
  typeof schema
>

export async function extractTwitterLink(
  prevState: ExtractTwitterFormState,
  formData: FormData
): Promise<ExtractTwitterFormState> {
  try {
    const safeParsedResult = schema.safeParse(formData.get('link'))

    if (!safeParsedResult.success) {
      return {
        status: 'error',
        formErrors: null,
        errorMessage: 'URL is not a valid X link'
      }
    }

    const existedMeme = await prisma.meme.findFirst({
      where: {
        tweetUrl: safeParsedResult.data.url
      }
    })

    if (existedMeme) {
      redirect(`/library/${existedMeme.id}`, RedirectType.push)
    }

    const tweet = await getTweetById(safeParsedResult.data.twitterId)

    if (!tweet) {
      return {
        status: 'error',
        formErrors: null,
        errorMessage: 'Tweet not exist or does not include a video'
      }
    }

    if (tweet.video.blob.size > MAX_SIZE_MEME_IN_BYTES) {
      return {
        status: 'error',
        formErrors: null,
        errorMessage: `Video size is too big: ${filesize(tweet.video.blob.size)}`
      }
    }

    const [videoFileResult, posterFileResult] = await utapi.uploadFiles([
      tweet.video.file,
      tweet.video.poster.file
    ])

    if (videoFileResult.error || posterFileResult.error) {
      return await Promise.reject(
        videoFileResult.error?.message || posterFileResult.error?.message
      )
    }

    let meme: Meme

    try {
      meme = await prisma.meme.create({
        data: {
          title: 'Titre inconnu',
          tweetUrl: safeParsedResult.data.url,
          video: {
            create: {
              poster: posterFileResult.data.url,
              posterUtKey: posterFileResult.data.key,
              src: videoFileResult.data.url,
              videoUtKey: videoFileResult.data.key
            }
          }
        },
        include: {
          video: true
        }
      })
    } catch (error) {
      // Looks like we have to wait a minimum of time before directly removing a file
      await wait(1000)
      // Remove files if something went wrong
      await utapi.deleteFiles([
        videoFileResult.data.key,
        posterFileResult.data.key
      ])
      throw error
    }

    revalidatePath('/library', 'page')
    redirect(`/library/${meme.id}`, RedirectType.push)
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    // eslint-disable-next-line no-console
    console.error(error)

    return {
      status: 'error',
      formErrors: null,
      errorMessage: 'An unknown error occurred'
    }
  }
}
