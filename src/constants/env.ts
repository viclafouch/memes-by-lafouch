import { z } from 'zod'

const serverEnvsSchema = z.object({
  AUTH_SECRET: z.string(),
  AUTH_TWITTER_ACCOUNT_ID_AUTHORIZED: z.string(),
  AUTH_TWITTER_ID: z.string(),
  AUTH_TWITTER_SECRET: z.string(),
  UPLOADTHING_SECRET: z.string(),
  UPLOADTHING_APP_ID: z.string()
})

const serverEnv = {
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_TWITTER_ACCOUNT_ID_AUTHORIZED:
    process.env.AUTH_TWITTER_ACCOUNT_ID_AUTHORIZED,
  AUTH_TWITTER_ID: process.env.AUTH_TWITTER_ID,
  AUTH_TWITTER_SECRET: process.env.AUTH_TWITTER_SECRET,
  UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
  UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID
} as const

const SERVER_ENVS = serverEnvsSchema.parse(serverEnv)

export { SERVER_ENVS }
