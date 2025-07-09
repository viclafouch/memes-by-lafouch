import { z } from 'zod/v4'

const serverEnvsSchema = z.object({
  AUTH_TWITTER_ID: z.string(),
  AUTH_TWITTER_SECRET: z.string(),
  UPLOADTHING_TOKEN: z.string(),
  BETTER_AUTH_SECRET: z.string()
})

const serverEnv = {
  AUTH_TWITTER_ID: process.env.AUTH_TWITTER_ID,
  AUTH_TWITTER_SECRET: process.env.AUTH_TWITTER_SECRET,
  UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET
} as const

const SERVER_ENVS = serverEnvsSchema.parse(serverEnv)

export { SERVER_ENVS }
