'use server'

import { TWITTER_LINK_SCHEMA } from '@/constants/meme'
import type { SimpleFormState } from '@/serverActions/types'
import type { getTweetById } from '@/utils/tweet'

const schema = TWITTER_LINK_SCHEMA

export type GetTweetFormLinkState = SimpleFormState<
  { tweet: Awaited<ReturnType<typeof getTweetById>> },
  typeof schema
>

export async function getTweetFromLink(
  prevState: GetTweetFormLinkState,
  formData: FormData
): Promise<GetTweetFormLinkState> {
  try {
    const safeParsedResult = await schema.safeParseAsync(
      formData.get('tweetUrl')
    )

    if (!safeParsedResult.success) {
      return {
        status: 'error',
        formErrors: null,
        errorMessage: 'URL is not a valid X link'
      }
    }

    if (!safeParsedResult.data) {
      return {
        status: 'error',
        formErrors: null,
        errorMessage: 'Tweet not exist or does not include a video'
      }
    }

    return {
      tweet: safeParsedResult.data,
      status: 'success'
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)

    return {
      status: 'error',
      formErrors: null,
      errorMessage: 'An unknown error occurred'
    }
  }
}
