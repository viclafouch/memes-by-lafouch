import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import { reactStartCookies } from 'better-auth/react-start'
import { ENV } from '@/constants/env'
import { prismaClient } from '@/db'
import { serverOnly } from '@tanstack/react-start'

const getAuthConfig = serverOnly(() => {
  return betterAuth({
    appName: 'Meme By Lafouch',
    basePath: '/api/auth',
    secret: ENV.BETTER_AUTH_SECRET,
    database: prismaAdapter(prismaClient, {
      provider: 'postgresql'
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: 4,
      maxPasswordLength: 20
    },
    socialProviders: {
      twitter: {
        clientId: ENV.AUTH_TWITTER_ID,
        clientSecret: ENV.AUTH_TWITTER_SECRET
      }
    },
    plugins: [admin(), reactStartCookies()]
  })
})

export const auth = getAuthConfig()
