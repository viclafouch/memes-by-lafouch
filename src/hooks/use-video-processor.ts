import React from 'react'
import type { ProgressEvent } from '@ffmpeg/ffmpeg'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

interface VideoProcessingOptions {
  videoBlob: Blob
  text: string
  bandHeight?: number
  fontSize?: number
  fontColor?: string
}

const addTextToVideo = async (
  ffmpeg: FFmpeg,
  {
    videoBlob,
    text,
    bandHeight = 100,
    fontSize = 24,
    fontColor = 'black'
  }: VideoProcessingOptions
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
    onSuccess: (blob: Blob) => void
    onError: (error: Error) => void
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
      await ffmpeg.load()
      ffmpeg.on('progress', progressSubscription)
    },
    mutationFn: async ({
      videoBlob,
      text,
      bandHeight = 100,
      fontSize = 24,
      fontColor = 'black'
    }: VideoProcessingOptions) => {
      return addTextToVideo(ffmpeg, {
        videoBlob,
        text,
        bandHeight,
        fontSize,
        fontColor
      })
    },
    onSuccess: (blob) => {
      options?.onSuccess(blob)
    },
    onError: (error) => {
      options?.onError(error)
    },
    onSettled: () => {
      ffmpeg.terminate()
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
