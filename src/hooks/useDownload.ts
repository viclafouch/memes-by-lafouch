import { downloadBlob } from '@/utils/download'
import { useMutation } from '@tanstack/react-query'

export function useDownload() {
  return useMutation({
    mutationFn: async ({ url }: { filename: string; url: string }) => {
      const response = await fetch(url)

      return response.blob()
    },
    onSuccess: (blob, { filename }) => {
      downloadBlob(blob, filename)
    }
  })
}
