import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import { reactStartCookies } from 'better-auth/react-start'
import { ENV } from '@/constants/env'
import { PRODUCT_ID } from '@/constants/polar'
import { prismaClient } from '@/db'
import { resendClient } from '@/lib/resend'
import { checkout, polar, portal } from '@polar-sh/better-auth'
import { Polar } from '@polar-sh/sdk'
import { serverOnly } from '@tanstack/react-start'
import EmailVerification from '../../emails/email-verification'
import ResetPassword from '../../emails/reset-password'

export const polarClient = new Polar({
  accessToken: ENV.POLAR_ACCESS_TOKEN,
  server: 'sandbox'
})

const getAuthConfig = serverOnly(() => {
  return betterAuth({
    appName: 'Petit Meme',
    basePath: '/api/auth',
    secret: ENV.BETTER_AUTH_SECRET,
    database: prismaAdapter(prismaClient, {
      provider: 'postgresql'
    }),
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60 // Cache duration in seconds
      }
    },
    user: {
      deleteUser: {
        enabled: true,
        afterDelete: async (user) => {
          await polarClient.customers.deleteExternal({
            externalId: user.id
          })
        }
      }
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: 4,
      maxPasswordLength: 100,
      sendResetPassword: async ({ user, url }) => {
        await resendClient.emails.send({
          from: 'Petit Meme <hello@petit-meme.io>',
          to: ENV.RESEND_EMAIL_TO ?? user.email,
          subject: 'Réinitialise ton mot de passe Petit Mème',
          react: <ResetPassword username={user.name} resetUrl={url} />
        })

        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.log('Sending reset password email to:', user.email, url)
        }
      },
      requireEmailVerification: true
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      expiresIn: 3600, // 1 hour
      sendVerificationEmail: async ({ user, url }) => {
        await resendClient.emails.send({
          from: 'Petit Meme <hello@petit-meme.io>',
          to: ENV.RESEND_EMAIL_TO ?? user.email,
          subject: 'Confirme ton inscription à Petit Mème',
          react: (
            <EmailVerification username={user.name} verificationUrl={url} />
          )
        })

        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.log('Sending verification email to:', user.email, url)
        }
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
    plugins: [
      admin(),
      reactStartCookies(),
      polar({
        client: polarClient,
        createCustomerOnSignUp: true,
        use: [
          checkout({
            products: [
              {
                productId: PRODUCT_ID,
                slug: 'pro'
              }
            ],
            theme: 'dark',
            successUrl: ENV.POLAR_SUCCESS_URL,
            authenticatedUsersOnly: true
          }),
          portal()
        ]
      })
    ]
  })
})

export const auth = getAuthConfig()
