import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import { prismaClient } from '@/db'
import { SERVER_ENVS } from '@/server/env'

export const auth = betterAuth({
  appName: 'Meme By Lafouch',
  basePath: '/api/auth',
  secret: SERVER_ENVS.BETTER_AUTH_SECRET,
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
      clientId: SERVER_ENVS.AUTH_TWITTER_ID,
      clientSecret: SERVER_ENVS.AUTH_TWITTER_SECRET
    }
  },
  plugins: [admin()]
})
