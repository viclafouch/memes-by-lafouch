import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

export interface VideoProcessingOptions {
  videoBlob: Blob
  text: string
  bandHeight?: number
  fontSize?: number
  fontColor?: string
}

export class VideoProcessor {
  ffmpeg: FFmpeg

  constructor() {
    this.ffmpeg = new FFmpeg()
  }

  async initialize(onLog?: (message: string) => void) {
    if (!this.ffmpeg.loaded) {
      if (onLog) {
        this.ffmpeg.on('log', ({ message }) => {
          onLog(message)
        })
      }

      await this.ffmpeg.load()
    }
  }

  async addTextBand(
    {
      videoBlob,
      text,
      bandHeight = 100,
      fontSize = 24,
      fontColor = 'black'
    }: VideoProcessingOptions,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    // Setup progress tracking pour le processing
    if (onProgress) {
      this.ffmpeg.on('progress', ({ progress }) => {
        onProgress(Math.round(progress * 100))
      })
    }

    await this.ffmpeg.writeFile('input.mp4', await fetchFile(videoBlob))

    await this.ffmpeg.writeFile(
      'arial.ttf',
      await fetchFile(
        'https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf'
      )
    )
    await this.ffmpeg.exec([
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

    const data = await this.ffmpeg.readFile('output.mp4')

    return new Blob([data as Uint8Array], { type: 'video/mp4' })
  }
}
