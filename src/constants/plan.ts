export type Plan = {
  title: string
  maxGenerationsCount: number
  maxFavoritesCount: number
  productId: string
  monthlyPriceInCents: number
  description: string
  features: string[]
  isExclusive?: boolean
}

export const FREE_PLAN = {
  title: 'Free',
  maxGenerationsCount: 1,
  maxFavoritesCount: 20,
  monthlyPriceInCents: 0,
  productId: 'free',
  isExclusive: false,
  description: 'Essential features you need to get started',
  features: []
} as const satisfies Plan

export const PREMIUM_PLAN = {
  title: 'Premium',
  maxGenerationsCount: 1,
  maxFavoritesCount: 20,
  monthlyPriceInCents: 399,
  productId: 'f9395cde-98ed-4d06-9631-b9b9f0a64566',
  isExclusive: true,
  description: 'Essential features you need to get started',
  features: []
} as const satisfies Plan
