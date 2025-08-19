import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import { reactStartCookies } from 'better-auth/react-start'
import { ENV } from '@/constants/env'
import { prismaClient } from '@/db'
import { resendClient } from '@/lib/resend'
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
      maxPasswordLength: 20,
      requireEmailVerification: true
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      expiresIn: 3600, // 1 hour
      sendVerificationEmail: async ({ user, url }) => {
        await resendClient.emails.send({
          from: 'Acme <onboarding@resend.dev>',
          to: user.email,
          subject: 'Email Verification',
          html: `Click the link to verify your email: ${url}`
        })
      },
      async afterEmailVerification(user) {
        // eslint-disable-next-line no-console
        console.log(`${user.email} has been successfully verified!`)
      }
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
