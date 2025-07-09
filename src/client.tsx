// src/entry-client.tsx
import { hydrateRoot } from 'react-dom/client'
import { z } from 'zod/v4'
import { RouterClient } from '@tanstack/react-router/ssr/client'
import { createRouter } from './router'

z.config(z.locales.fr())

const router = createRouter()

hydrateRoot(document, <RouterClient router={router} />)
