import { z } from 'zod'
import { SERVER_ENVS } from '@/server/env'
import { BUNNY_CONFIG } from '../constants/bunny'
import { fetchWithZod } from './utils'

const { collectionId: COLLECTION_ID, libraryId: LIBRARY_ID } = BUNNY_CONFIG

const getHeaders = () => {
  const headers = new Headers()
  headers.set('AccessKey', SERVER_ENVS.BUNNY_ACCESS_KEY)
  headers.set('accept', 'application/json')
  headers.set('Content-Type', 'application/json')

  return headers
}

const DEFAULT_RESPONSE_SCHEMA = z.object({
  success: z.literal(true)
})

export const deleteVideo = async (videoId: string) => {
  return fetchWithZod(
    DEFAULT_RESPONSE_SCHEMA,
    `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`,
    {
      method: 'DELETE',
      headers: getHeaders()
    }
  )
}

const UPLOAD_RESPONSE_SCHEMA = z.object({
  guid: z.string()
})

export const uploadVideo = async (videoBuffer: Buffer, title: string) => {
  const { guid: videoId } = await fetchWithZod(
    UPLOAD_RESPONSE_SCHEMA,
    `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        title,
        collectionId: COLLECTION_ID
      })
    }
  )

  const headers = getHeaders()
  headers.set('Content-Type', 'application/octet-stream')

  await fetchWithZod(
    DEFAULT_RESPONSE_SCHEMA,
    `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`,
    {
      method: 'PUT',
      headers,
      body: videoBuffer
    }
  )

  return {
    videoId
  }
}
