export const BUNNY_CONFIG = {
  collectionId: '3d12803f-7837-4586-87c7-7e8cb2789761',
  libraryId: 471900
} as const

// See https://docs.bunny.net/docs/stream-webhook#status-list
export const BUNNY_STATUS = {
  QUEUED: 0,
  PROCESSING: 1,
  ENCODING: 2,
  FINISHED: 3,
  RESOLUTION_FINISHED: 4,
  FAILED: 5,
  PRESIGNED_UPLOAD_STARTED: 6,
  PRESIGNED_UPLOAD_FINISHED: 7,
  PRESIGNED_UPLOAD_FAILED: 8,
  CAPTIONS_GENERATED: 9,
  TITLE_OR_DESCRIPTION_GENERATED: 10
} as const
