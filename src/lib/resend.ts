import { Resend } from 'resend'
import { ENV } from '@/constants/env'

export const resendClient = new Resend(ENV.RESEND_SECRET)
