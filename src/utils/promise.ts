export async function withTimeout<T extends Promise<unknown>>(
  promise: T,
  timeout: number
): Promise<Awaited<T>> {
  return Promise.race([
    promise,
    new Promise((resolve, reject) => {
      return setTimeout(reject, timeout)
    }) as never
  ])
}

export async function wait(timeout: number) {
  return new Promise((resolve) => {
    return setTimeout(resolve, timeout)
  })
}
