import React from 'react'

export async function lockOrientiation(orientation: string) {
  try {
    // @ts-expect-error
    await screen.orientation.lock(orientation)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name !== 'NotSupportedError' && error.name !== 'AbortError') {
        // See https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock#exceptions
        // eslint-disable-next-line no-console
        console.warn(error)
      }
    }
  }
}

export const OnlyPortrait = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    lockOrientiation('portrait')
  }, [])

  return children
}
