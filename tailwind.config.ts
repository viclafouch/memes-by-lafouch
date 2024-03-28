import type { Config } from 'tailwindcss'
import { withUt } from 'uploadthing/tw'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { nextui } = require('@nextui-org/react')

const config: Config = withUt({
  content: [
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{ts,tsx,mdx}'
  ],
  theme: {
    extend: {}
  },
  darkMode: 'class',
  plugins: [nextui()]
})

export default config
