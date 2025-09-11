import { adminClient } from 'better-auth/client/plugins'
import type { UserWithRole } from 'better-auth/plugins'
import { createAuthClient } from 'better-auth/react'
import type { StudioErrorCode } from '@/constants/error'
import { polarClient } from '@polar-sh/better-auth'

export const authClient = createAuthClient({
  plugins: [adminClient(), polarClient()]
})

export const matchIsUserAdmin = (user: UserWithRole) => {
  return user.role === 'admin'
}

type ErrorTypes = Partial<
  Record<
    StudioErrorCode | keyof typeof authClient.$ERROR_CODES,
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
  },
  PASSWORD_TOO_SHORT: {
    en: 'Password too short',
    fr: 'Mot de passe trop court'
  },
  PREMIUM_REQUIRED: {
    en: 'Premium required',
    fr: 'Premium requis'
  },
  UNAUTHORIZED: {
    en: 'You must be logged in',
    fr: 'Vous devez être connecté'
  }
} satisfies ErrorTypes

export const getErrorMessage = (
  error: { code?: string; message?: string },
  lang: 'en' | 'fr'
) => {
  if (error.code && error.code in ERROR_CODES) {
    return ERROR_CODES[error.code as keyof typeof ERROR_CODES][lang]
  }

  if (process.env.NODE_ENV === 'development') {
    return error.message
  }

  return 'Une erreur inattendue s’est produite'
}
