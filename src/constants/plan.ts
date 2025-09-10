export type PlanFeature = {
  label: string
  status: 'included' | 'limited' | 'not_included'
  note?: string
}

export type Plan = {
  title: string
  maxGenerationsCount: number
  maxFavoritesCount: number
  productId: string
  monthlyPriceInCents: number
  description: string
  features: PlanFeature[]
  isExclusive?: boolean
}

export const FREE_PLAN = {
  title: 'Testeur',
  maxGenerationsCount: 3,
  maxFavoritesCount: 20,
  monthlyPriceInCents: 0,
  productId: 'free',
  isExclusive: false,
  description:
    'Testez gratuitement et sans limite de temps. Découvrez les mèmes, créez vos premiers contenus et enregistrez vos favoris sans sortir la carte bleue.',
  features: [
    { label: 'Accès aux mèmes publics', status: 'included' },
    { label: 'Favoris enregistrés', status: 'limited', note: '20 max' },
    {
      label: 'Générations de vidéos',
      status: 'limited',
      note: '3 max'
    }
  ]
} as const satisfies Plan

export const PREMIUM_PLAN = {
  title: 'Premium',
  maxGenerationsCount: Number.MAX_SAFE_INTEGER,
  maxFavoritesCount: Number.MAX_SAFE_INTEGER,
  monthlyPriceInCents: 399,
  productId: 'f9395cde-98ed-4d06-9631-b9b9f0a64566',
  isExclusive: true,
  description:
    'Passez en mode illimité. Créez autant de vidéos que vous voulez, sauvegardez tous vos favoris et profitez d’une expérience sans aucune restriction.',
  features: [
    { label: 'Accès aux mèmes publics', status: 'included' },
    { label: 'Favoris enregistrés', status: 'included', note: 'illimité' },
    {
      label: 'Générations de vidéos',
      status: 'included',
      note: 'illimité'
    }
  ]
} as const satisfies Plan
