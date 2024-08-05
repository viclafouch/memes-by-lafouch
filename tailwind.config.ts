/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable global-require */
import type { Config } from 'tailwindcss'

const { nextui } = require('@nextui-org/react')

const config: Config = {
  content: [
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{ts,tsx,mdx}'
  ],
  theme: {
    extend: {}
  },
  darkMode: 'class',
  plugins: [nextui(), require('tailwindcss-animate')]
}

export default config
