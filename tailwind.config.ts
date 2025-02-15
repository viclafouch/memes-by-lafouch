/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable global-require */
import type { Config } from 'tailwindcss'

const { heroui } = require('@heroui/react')

const config: Config = {
  content: [
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{ts,tsx,mdx}'
  ],
  theme: {
    extend: {}
  },
  darkMode: 'class',
  plugins: [heroui(), require('tailwindcss-animate')]
}

export default config
