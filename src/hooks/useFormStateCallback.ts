import React from 'react'
import { useEvent } from '@/hooks/useEvent'

type ResultCallbackArgs<T> = Exclude<T, false>

type Options<T, E, S> = {
  isError: (formState: T) => E
  isSuccess: (formState: T) => S
  onError: (formState: ResultCallbackArgs<E>) => void
  onSuccess: (formState: ResultCallbackArgs<S>) => void
}

function matchIsCallbackEnabled<T>(values: T): values is ResultCallbackArgs<T> {
  return values !== false
}

export function useFormStateCallback<T, E, S>(
  formState: T,
  { isError, isSuccess, onError, onSuccess }: Options<T, E, S>
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
