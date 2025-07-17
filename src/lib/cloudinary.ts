/* eslint-disable camelcase */
import type { UploadApiResponse } from 'cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import { CLOUDINARY_CONFIG } from '@/constants/cloudinary'
import { SERVER_ENVS } from '@/server/env'

cloudinary.config({
  secure: true,
  cloud_name: CLOUDINARY_CONFIG.cloudName,
  api_key: CLOUDINARY_CONFIG.apiKey,
  api_secret: SERVER_ENVS.CLOUDINARY_KEY_SECRET
})

export { cloudinary }

export const deleteVideo = (cloudinaryId: string) => {
  return cloudinary.uploader.destroy(cloudinaryId, {
    resource_type: 'video'
  })
}

export const uploadVideo = (
  videoBuffer: Buffer
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'video',
          folder: 'memes',
          allowed_formats: ['mp4']
        },
        (error, result) => {
          if (error || !result) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      )
      .end(videoBuffer)
  })
}
