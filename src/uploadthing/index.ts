import { UTApi } from 'uploadthing/server'
import { SERVER_ENVS } from '@/constants/server-env'

export const utapi = new UTApi({
  token: SERVER_ENVS.UPLOADTHING_TOKEN
})
