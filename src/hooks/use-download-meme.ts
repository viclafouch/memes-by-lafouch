import { shareMeme } from '@/server/meme'
import { downloadBlob } from '@/utils/download'
import type { Meme } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'

export const useDownloadMeme = () => {
  return useMutation({
    mutationFn: async (meme: Meme) => {
      const response = await shareMeme({ data: meme.id })
      const blob = await response.blob()

      downloadBlob(blob, meme.title)
    }
  })
}
