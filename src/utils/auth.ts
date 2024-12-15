import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import Twitter from 'next-auth/providers/twitter'
import { z } from 'zod'
import { SERVER_ENVS } from '@/constants/env'

const TWITTER_PROFILE_ID = SERVER_ENVS.AUTH_TWITTER_ACCOUNT_ID_AUTHORIZED

const profileSchema = z.object({
  data: z.object({
    // eslint-disable-next-line camelcase
    profile_image_url: z.string(),
    id: z.enum([TWITTER_PROFILE_ID]),
    name: z.string(),
    username: z.string()
  })
})

export const config = {
  theme: {
    logo: 'https://next-auth.js.org/img/logo/logo-sm.png'
  },
  callbacks: {
    async signIn({ profile }) {
      const twitterData = await profileSchema.safeParseAsync(profile)

      return twitterData.success
    },
    authorized({ auth }) {
      return Boolean(auth)
    }
  },
  providers: [
    Twitter({
      id: 'twitter',
      name: 'Twitter',
      profile(props) {
        if (props.status === 429) {
          throw new Error('Twitter Too many Requests', { cause: props })
        }

        return {
          id: props.data.id,
          name: props.data.username,
          email: props.data.email ?? null,
          image: props.data.profile_image_url
        }
      }
    })
  ],
  basePath: '/api/auth'
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
