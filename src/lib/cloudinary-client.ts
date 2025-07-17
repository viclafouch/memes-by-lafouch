import { CLOUDINARY_CONFIG } from '@/constants/cloudinary'
import { Cloudinary } from '@cloudinary/url-gen'

export const cloudinaryClient = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CONFIG.cloudName
  },
  url: {
    secure: true,
    analytics: false
  }
})
