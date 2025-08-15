/* eslint-disable no-console */
import fs from 'node:fs/promises'
import { prismaClient } from '@/db'

export const exportJson = async () => {
  const memes = await prismaClient.meme.findMany({
    include: {
      video: true
    }
  })

  await fs.writeFile('./backup.json', JSON.stringify(memes, null, 2))

  console.log(`${memes.length} memes exported to ${process.cwd()}/backup.json`)
}

// npx vite-node scripts/export-json.ts
exportJson()
