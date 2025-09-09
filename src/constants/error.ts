export type StudioErrorCode = 'PREMIUM_REQUIRED' | 'UNAUTHORIZED'

export class StudioError extends Error {
  public readonly code: StudioErrorCode

  constructor(code: StudioErrorCode) {
    super(code.toLocaleLowerCase())
    this.code = code
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export const wrapServerFn = async <T extends Promise<unknown>>(fn: T) => {
  try {
    return await fn
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === 'StudioError' &&
      'code' in error
    ) {
      throw new StudioError(error.code as StudioErrorCode)
    }

    throw error
  }
}
