// src/entry-client.tsx
import { hydrateRoot } from 'react-dom/client'
import { z } from 'zod'
import { RouterClient } from '@tanstack/react-router/ssr/client'
import { createAppRouter } from './router'

z.config(z.locales.fr())

const router = createAppRouter()

hydrateRoot(document, <RouterClient router={router} />)
