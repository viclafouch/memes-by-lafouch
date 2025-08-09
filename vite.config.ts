import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 3000
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths({
      projects: ['./tsconfig.json']
    }),
    tanstackStart({
      customViteReactPlugin: true,
      tsr: {
        quoteStyle: 'single',
        semicolons: false
      }
    }),
    react()
  ]
})
