import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import { reactStartCookies } from 'better-auth/react-start'
import Stripe from 'stripe'
import { ENV } from '@/constants/env'
import { prismaClient } from '@/db'
import { resendClient } from '@/lib/resend'
import { stripe } from '@better-auth/stripe'
import { serverOnly } from '@tanstack/react-start'
import EmailVerification from '../../emails/email-verification'
import ResetPassword from '../../emails/reset-password'

const stripeClient = new Stripe(ENV.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil'
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
        enabled: true
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
      stripe({
        stripeClient,
        stripeWebhookSecret: ENV.STRIPE_WEBHOOK_SECRET,
        createCustomerOnSignUp: true,
        subscription: {
          enabled: true,
          plans: [
            {
              name: 'premium',
              priceId: 'price_1S8cc10e6MoMDhyQiHSOvnm4'
            }
          ]
        }
      })
    ]
  })
})

export const auth = getAuthConfig()
