import React from 'react'
import { Share2 } from 'lucide-react'
import { IconButton } from '@/components/animate-ui/buttons/icon'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/animate-ui/radix/dialog'
import { Progress } from '@/components/animate-ui/radix/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { downloadBlob, shareBlob } from '@/utils/download'
import { useMutation } from '@tanstack/react-query'

type StudioDialogExportProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  progress: number
  isLoading: boolean
  data?: {
    blob: Blob
    url: string
    title: string
  }
}

const ShareButton = ({ blob, title }: { blob: Blob; title: string }) => {
  const shareMutation = useMutation({
    mutationFn: () => {
      return shareBlob(blob, title)
    }
  })

  const handleShare = () => {
    if (shareMutation.isPending) {
      return
    }

    shareMutation.mutate()
  }

  return (
    <IconButton
      icon={Share2}
      active={shareMutation.isPending}
      onClick={handleShare}
    />
  )
}

export const StudioDialogExport = ({
  open,
  onOpenChange,
  progress,
  isLoading,
  data
}: StudioDialogExportProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Prévisualisation</DialogTitle>
          <DialogDescription>
            {isLoading
              ? 'Votre vidéo est en cours de traitement...'
              : 'Votre vidéo est prête à être téléchargée et partagée !'}
          </DialogDescription>
        </DialogHeader>
        {data || isLoading ? (
          <>
            {isLoading ? (
              <div className="group bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm border border-white/10">
                <div className="w-full h-full flex items-center justify-center relative">
                  <Skeleton className="w-full h-full bg-stone-700 absolute inset-0" />
                  <div className="absolute flex flex-col gap-2 px-4 w-full text-center max-w-md items-center justify-center">
                    <Badge variant="outline">Traitement ({progress}%)</Badge>
                    <Progress value={progress} />
                  </div>
                </div>
              </div>
            ) : data ? (
              <video src={data.url} controls className="w-full" />
            ) : null}
          </>
        ) : null}
        <DialogFooter>
          {data ? (
            <div className="w-full justify-center flex items-center gap-2">
              <ShareButton blob={data.blob} title={data.title} />
              <Button
                onClick={(event) => {
                  event.preventDefault()

                  downloadBlob(data.blob, `${data.title}.mp4`)
                }}
              >
                Télécharger
              </Button>
            </div>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
