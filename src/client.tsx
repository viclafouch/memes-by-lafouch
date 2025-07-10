// src/entry-client.tsx
import { hydrateRoot } from 'react-dom/client'
import { z } from 'zod'
import { RouterClient } from '@tanstack/react-router/ssr/client'
import { injectSpeedInsights } from '@vercel/speed-insights'
import { createRouter } from './router'

z.config(z.locales.fr())

injectSpeedInsights()

const router = createRouter()

hydrateRoot(document, <RouterClient router={router} />)
