import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { APIError } from 'better-auth/api'
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
  socialProviders: {
    twitter: {
      clientId: SERVER_ENVS.AUTH_TWITTER_ID,
      clientSecret: SERVER_ENVS.AUTH_TWITTER_SECRET
    }
  },
  plugins: [admin()],
  databaseHooks: {
    user: {
      create: {
        before: async () => {
          throw new APIError('FORBIDDEN', {
            message: 'You are not allowed to use the app!',
            code: 'NOT-ALLOWED'
          })
        }
      }
    }
  }
})
