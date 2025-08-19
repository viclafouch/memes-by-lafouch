import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

export const ENV = createEnv({
  server: {
    AUTH_TWITTER_ID: z.string(),
    AUTH_TWITTER_SECRET: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    BUNNY_ACCESS_KEY: z.string(),
    ALGOLIA_SECRET: z.string(),
    RESEND_SECRET: z.string()
  },
  clientPrefix: 'PUBLIC_',
  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
})
