import React from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import type { MemeWithVideo } from '@/constants/meme'

const extractCurrentFrame = (video: HTMLVideoElement) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  context.drawImage(video, 0, 0, canvas.width, canvas.height)

  const base64 = canvas.toDataURL('image/jpeg', 0.9)

  return base64
}

type VideoFrameExtractorDialogProps = {
  onOpenChange: (isOpen: boolean) => void
  isOpen: boolean
  videoSrc: MemeWithVideo['video']['src']
  onExtractFrame: (frame: string) => void
}

export const VideoFrameExtractorDialog = ({
  onOpenChange,
  isOpen,
  onExtractFrame,
  videoSrc
}: VideoFrameExtractorDialogProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null!)

  const handleExtractFrame = () => {
    try {
      const frame = extractCurrentFrame(videoRef.current)
      onExtractFrame(frame)
    } catch (error) {
      toast.error("Impossible d'extraire la miniature")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Extracteur de miniature</DialogTitle>
          <DialogDescription>
            Utilisez cet outil pour extraire une miniature de la vidéo.
          </DialogDescription>
        </DialogHeader>
        <div>
          <video
            src={videoSrc}
            autoPlay
            controlsList="nodownload,nofullscreen"
            muted
            controls
            disablePictureInPicture
            ref={videoRef}
            crossOrigin="anonymous"
            className="w-full max-h-96"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleExtractFrame}>Utiliser comme miniature</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
