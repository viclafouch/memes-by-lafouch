/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable global-require */
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {}
  },
  darkMode: 'class',
  plugins: [require('daisyui'), require('tailwindcss-animate')]
}

export default config
