import Stripe from 'stripe'
import { ENV } from '@/constants/env'

export const stripeClient = new Stripe(ENV.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil'
})
