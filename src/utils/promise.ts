/* eslint-disable promise/prefer-await-to-then */
export async function wait(
  timeout: number,
  { throwInstead }: { throwInstead: boolean } = { throwInstead: false }
) {
  await new Promise((resolve, reject) => {
    setTimeout(throwInstead ? reject : resolve, timeout)
  })
}

// We use a class in order to differenciate it
// with a classic Error.
class TimeoutError extends Error {
  timeout: number

  constructor(timeout: number) {
    super()
    // Not very useful, by maybe you want to access the timeout value
    this.timeout = timeout
  }
}

export async function withTimeout<T extends Promise<unknown>>(
  promise: T,
  maxTime = 3000,
  onTimeout = () => {}
): Promise<Awaited<T>> {
  if (maxTime === 0) {
    return Promise.resolve(promise)
  }

  let timer: NodeJS.Timeout | undefined

  const timeout = wait(maxTime, {
    throwInstead: true
  }).catch(() => {
    return new TimeoutError(maxTime)
  })

  try {
    return await Promise.race([timeout as never, promise])
  } catch (error: unknown) {
    if (error instanceof TimeoutError) {
      // Maybe you want to abort the current fetch
      onTimeout()
    }

    return await Promise.reject<never>(error)
  } finally {
    clearTimeout(timer)
  }
}
