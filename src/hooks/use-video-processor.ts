import React from 'react'
import { shareMeme } from '@/server/meme'
import type { ProgressEvent } from '@ffmpeg/ffmpeg'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import type { Meme } from '@prisma/client'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

type VideoProcessingOptions = {
  text: string
  bandHeight?: number
  fontSize?: number
  fontColor?: string
}

type ProcessingParams = {
  videoBlob: Blob
} & VideoProcessingOptions

type MutationBody = {
  meme: Meme
} & VideoProcessingOptions

const addTextToVideo = async (
  ffmpeg: FFmpeg,
  {
    videoBlob,
    text,
    bandHeight = 100,
    fontSize = 24,
    fontColor = 'black'
  }: ProcessingParams
) => {
  await ffmpeg.writeFile('input.mp4', await fetchFile(videoBlob))
  await ffmpeg.writeFile(
    'arial.ttf',
    await fetchFile(
      'https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf'
    )
  )

  await ffmpeg.exec([
    '-i',
    'input.mp4',
    '-vf',
    [
      `pad=iw:ih+${bandHeight}:0:0:white`,
      `drawtext=fontfile=/arial.ttf:text='${text}':x=(w-text_w)/2:y=h-${Math.floor(bandHeight / 2)}:fontsize=${fontSize}:fontcolor=${fontColor}`
    ].join(','),
    '-c:a',
    'copy',
    '-preset',
    'ultrafast',
    '-crf',
    '20',
    '-y',
    'output.mp4'
  ])

  const data = await ffmpeg.readFile('output.mp4')

  return new Blob([data as Uint8Array], { type: 'video/mp4' })
}

export const useVideoInitializer = () => {
  const query = useSuspenseQuery({
    queryFn: async () => {
      const ffmpeg = new FFmpeg()

      await ffmpeg.load()

      return ffmpeg
    },
    queryKey: ['video-processor-init'],
    staleTime: Infinity,
    refetchOnMount: 'always'
  })

  React.useEffect(() => {
    return () => {
      query.data.terminate()
    }
  }, [])

  return query
}

export const useVideoProcessor = (
  ffmpeg: FFmpeg,
  options?: {
    onMutate?: () => void
    onSuccess?: (blob: Blob) => void
    onError?: (error: Error) => void
  }
) => {
  const [progress, setProgress] = React.useState(0)

  const progressSubscription = React.useCallback(
    (progressEvent: ProgressEvent) => {
      setProgress(Math.round(progressEvent.progress * 100))
    },
    []
  )

  const mutation = useMutation({
    onMutate: async () => {
      setProgress(0)
      options?.onMutate?.()
      await ffmpeg.load()
      ffmpeg.on('progress', progressSubscription)
    },
    mutationFn: async ({
      meme,
      text,
      bandHeight = 100,
      fontSize = 24,
      fontColor = 'black'
    }: MutationBody) => {
      const response = await shareMeme({ data: meme.id })
      const videoBlob = await response.blob()
      const blob = await addTextToVideo(ffmpeg, {
        videoBlob,
        text,
        bandHeight,
        fontSize,
        fontColor
      })

      return {
        blob,
        url: URL.createObjectURL(blob),
        title: meme.title
      }
    },
    onSuccess: ({ blob }) => {
      options?.onSuccess?.(blob)
    },
    onError: (error) => {
      options?.onError?.(error)
    },
    onSettled: () => {
      try {
        ffmpeg.terminate()
      } catch (error) {
        console.log(error)
      }
    }
  })

  React.useEffect(() => {
    return () => {
      ffmpeg.terminate()
    }
  }, [])

  return {
    processVideo: mutation.mutate,
    progress,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
    reset: () => {
      mutation.reset()
      setProgress(0)
    }
  }
}
