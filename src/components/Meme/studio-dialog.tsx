import React from 'react'
import { Download, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/animate-ui/radix/dialog'
import { Progress } from '@/components/animate-ui/radix/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import type { MemeWithVideo } from '@/constants/meme'
import {
  useVideoInitializer,
  useVideoProcessor
} from '@/hooks/use-video-processor'
import { buildVideoImageUrl } from '@/lib/bunny'
import { downloadBlob, shareBlob } from '@/utils/download'

export const StudioDialog = ({
  meme,
  open,
  onOpenChange
}: {
  meme: MemeWithVideo
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const { data: ffmpeg } = useVideoInitializer()
  const [text, setText] = React.useState('')
  const [textPosition, setTextPosition] = React.useState<'top' | 'bottom'>(
    'top'
  )

  const { progress, processVideo, isLoading, data } = useVideoProcessor(ffmpeg)

  const handleInitialize = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!text.trim()) {
      toast.error('Veuillez saisir du texte')

      return
    }

    processVideo({ meme, text, textPosition })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Studio - {meme.title}</DialogTitle>
          <DialogDescription>
            Ajouter des éléments à la vidéo comme un texte en légende.
          </DialogDescription>
        </DialogHeader>
        <form
          className="w-full grid md:grid-cols-[auto_350px] gap-4"
          onSubmit={handleInitialize}
        >
          <div className="flex flex-col gap-3 items-start">
            <div className="flex flex-col gap-y-2 w-full">
              <Input
                value={text}
                onChange={(event) => {
                  setText(event.target.value)
                }}
                placeholder="Texte à ajouter"
                name="text"
                autoComplete="off"
                type="text"
              />
              <div className="relative flex w-full text-muted-foreground">
                <div className="w-full">
                  <input
                    type="radio"
                    id="position-top"
                    value="top"
                    checked={textPosition === 'top'}
                    onChange={() => {
                      return setTextPosition('top')
                    }}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="position-top"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 peer-checked:bg-muted peer-checked:text-foreground peer-checked:shadow w-full text-center"
                  >
                    Texte en haut
                  </label>
                </div>
                <div className="w-full">
                  <input
                    type="radio"
                    id="position-bottom"
                    value="bottom"
                    checked={textPosition === 'bottom'}
                    onChange={() => {
                      return setTextPosition('bottom')
                    }}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor="position-bottom"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 peer-checked:bg-muted peer-checked:text-foreground peer-checked:shadow w-full text-center"
                  >
                    Texte en bas
                  </label>
                </div>
              </div>
              <LoadingButton type="submit" isLoading={isLoading}>
                Prévisualiser
              </LoadingButton>
            </div>
            <Separator />
            <div className="flex flex-col gap-2 w-full">
              <Button
                variant="secondary"
                disabled={!data}
                type="button"
                className="md:hidden"
                onClick={() => {
                  if (data) {
                    shareBlob(data.blob, data.title)
                  }
                }}
              >
                <Share2 />
                Partager la vidéo
              </Button>
              <Button
                variant="secondary"
                type="button"
                disabled={!data}
                onClick={() => {
                  if (data) {
                    downloadBlob(data.blob, `${data.title}.mp4`)
                  }
                }}
              >
                <Download />
                Télécharger la vidéo
              </Button>
              <p className="text-muted-foreground text-xs text-center md:text-left">
                Quand tu ajoutes du texte à ta vidéo, tout se fait directement
                sur ton appareil. Rien n’est envoyé ni stocké sur nos serveurs —
                tes fichiers restent donc privés et entre tes mains.
              </p>
            </div>
          </div>
          <div className="w-full -order-1">
            <div className="group bg-muted relative aspect-video w-full overflow-hidden rounded-lg text-sm border border-white/10">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center relative">
                  <Skeleton className="w-full h-full absolute inset-0">
                    <img
                      src={buildVideoImageUrl(meme.video.bunnyId)}
                      className="blur-xl w-full h-full opacity-60 object-cover"
                      alt={meme.title}
                      loading="eager"
                    />
                  </Skeleton>
                  <div className="absolute flex flex-col gap-2 px-4 w-full text-center max-w-md items-center justify-center">
                    <Badge variant="outline">Traitement ({progress}%)</Badge>
                    <Progress value={progress} />
                  </div>
                </div>
              ) : data ? (
                <video
                  src={data.url}
                  autoPlay
                  className="aspect-video w-full"
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full bg-muted/50">
                  <img
                    src={buildVideoImageUrl(meme.video.bunnyId)}
                    className="blur-2xl w-full h-full opacity-40 object-cover"
                    alt={meme.title}
                    loading="eager"
                  />
                </div>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
