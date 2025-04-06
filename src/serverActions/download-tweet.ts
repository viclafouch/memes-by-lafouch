'use server'

import { flattenValidationErrors } from 'next-safe-action'
import { zfd } from 'zod-form-data'
import { TWITTER_LINK_SCHEMA } from '@/constants/meme'
import { actionClient } from '@/lib/safe-action'
import type { SimpleFormState } from '@/serverActions/types'
import type { getTweetById } from '@/utils/tweet'

const schema = zfd.formData({
  tweetUrl: TWITTER_LINK_SCHEMA
})

export type GetTweetFormLinkState = SimpleFormState<
  { tweet: Awaited<ReturnType<typeof getTweetById>> },
  typeof schema
>

export const getTweetFromLink = actionClient
  .schema(schema, {
    handleValidationErrorsShape: async (ve) => {
      return flattenValidationErrors(ve).fieldErrors
    }
  })

  .action(async ({ parsedInput: tweet }) => {
    return Promise.resolve(tweet.tweetUrl)
  })
