import { UTApi } from 'uploadthing/server'
import { SERVER_ENVS } from '@/constants/env'

export const utapi = new UTApi({
  apiKey: SERVER_ENVS.UPLOADTHING_SECRET
})
