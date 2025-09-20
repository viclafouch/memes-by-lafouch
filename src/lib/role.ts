import type { UserWithRole } from 'better-auth/plugins'

export const matchIsUserAdmin = (user: UserWithRole) => {
  return user.role === 'admin'
}
