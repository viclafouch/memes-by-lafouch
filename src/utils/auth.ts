import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import Twitter from 'next-auth/providers/twitter'

export const config = {
  theme: {
    logo: 'https://next-auth.js.org/img/logo/logo-sm.png'
  },
  providers: [
    Twitter({
      id: 'twitter',
      name: 'Twitter',
      profile({ data }) {
        return {
          id: data.id,
          name: data.username,
          email: data.email ?? null,
          image: data.profile_image_url
        }
      }
    })
  ],
  basePath: '/api/auth'
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
