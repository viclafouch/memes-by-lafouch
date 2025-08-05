import { adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { UserWithRole } from '@/constants/user'

export const authClient = createAuthClient({
  plugins: [adminClient()]
})

export const matchIsUserAdmin = (user: UserWithRole) => {
  return user.role === 'admin'
}
