import React from 'react'
import { useEvent } from '@/hooks/useEvent'

type ResultCallbackArgs<T> = Exclude<T, false>

type Options<T, TError, TSuccess> = {
  isError: (formState: T) => TError
  isSuccess: (formState: T) => TSuccess
  onError: (formState: ResultCallbackArgs<TError>) => void
  onSuccess: (formState: ResultCallbackArgs<TSuccess>) => void
}

function matchIsCallbackEnabled<T>(values: T): values is ResultCallbackArgs<T> {
  return values !== false
}

export function useFormStateCallback<T, TError, TSuccess>(
  formState: T,
  { isError, isSuccess, onError, onSuccess }: Options<T, TError, TSuccess>
) {
  const onErrorEvent = useEvent(onError)
  const onSuccessEvent = useEvent(onSuccess)
  const isMatchErrorEvent = useEvent(isError)
  const isMatchSuccessEvent = useEvent(isSuccess)

  React.useEffect(() => {
    const isErrorResult = isMatchErrorEvent(formState)

    if (matchIsCallbackEnabled(isErrorResult)) {
      onErrorEvent(isErrorResult)

      return
    }

    const isSuccessResult = isMatchSuccessEvent(formState)

    if (matchIsCallbackEnabled(isSuccessResult)) {
      onSuccessEvent(isSuccessResult)
    }
  }, [
    formState,
    onSuccessEvent,
    onErrorEvent,
    isMatchSuccessEvent,
    isMatchErrorEvent
  ])
}
