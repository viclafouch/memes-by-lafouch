import { adminClient } from 'better-auth/client/plugins'
import type { BetterFetchError } from 'better-auth/react'
import { createAuthClient } from 'better-auth/react'
import type { UserWithRole } from '@/constants/user'

export const authClient = createAuthClient({
  plugins: [adminClient()]
})

export const matchIsUserAdmin = (user: UserWithRole) => {
  return user.role === 'admin'
}

type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    {
      en: string
      fr: string
    }
  >
>

export const ERROR_CODES = {
  USER_ALREADY_EXISTS: {
    en: 'User already registered',
    fr: 'Utilisateur déjà inscrit'
  },
  INVALID_EMAIL_OR_PASSWORD: {
    en: 'Invalid email or password',
    fr: 'Email ou mot de passe invalide'
  }
} satisfies ErrorTypes

export const getErrorMessage = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: BetterFetchError & Record<string, any>,
  lang: 'en' | 'fr'
) => {
  if (error.code && error.code in ERROR_CODES) {
    return ERROR_CODES[error.code as keyof typeof ERROR_CODES][lang]
  }

  return error.message
}
