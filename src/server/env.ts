import { z } from 'zod'

const serverEnvsSchema = z.object({
  AUTH_TWITTER_ID: z.string(),
  AUTH_TWITTER_SECRET: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BUNNY_ACCESS_KEY: z.string()
})

const serverEnv = {
  AUTH_TWITTER_ID: process.env.AUTH_TWITTER_ID,
  AUTH_TWITTER_SECRET: process.env.AUTH_TWITTER_SECRET,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BUNNY_ACCESS_KEY: process.env.BUNNY_ACCESS_KEY
} as const

const SERVER_ENVS = serverEnvsSchema.parse(serverEnv)

export { SERVER_ENVS }
