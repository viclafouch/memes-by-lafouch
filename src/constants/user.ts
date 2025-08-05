import type { User } from 'better-auth'

export type UserWithRole = User & { role?: string | null }
