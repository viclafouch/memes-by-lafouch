import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from '@tanstack/start/config'

export default defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json']
      })
    ]
  }
})
