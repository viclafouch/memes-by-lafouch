import { buildVideoUrl } from 'cloudinary-build-url'
import { RESOURCE_TYPES, STORAGE_TYPES } from '@cld-apis/utils'

export function myVideoLoader({ src }: { src: string }) {
  return buildVideoUrl(src, {
    cloud: {
      cloudName: 'dltusgxea',
      secure: true,
      resourceType: RESOURCE_TYPES.VIDEO,
      storageType: STORAGE_TYPES.FETCH
    }
  })
}
