import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import prisma from '@/db'

const uploadthing = createUploadthing()

const auth = () => {
  return { id: 'fakeId' }
}

export const ourFileRouter = {
  videoUploader: uploadthing({
    video: { maxFileSize: '16MB', maxFileCount: 1 }
  })
    .middleware(async () => {
      const user = await auth()
      if (!user) throw new UploadThingError('Unauthorized')

      return { userId: user.id }
    })
    .onUploadComplete(async ({ file }) => {
      await prisma.meme.create({
        data: {
          title: 'test',
          videoUrl: file.url
        }
      })

      return {}
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
