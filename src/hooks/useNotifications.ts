import React from 'react'
import { toast, ToastOptions } from 'react-toastify'

export const useNotifications = () => {
  const notifySuccess = React.useCallback(
    (message: string, options?: ToastOptions) => {
      return toast.success(message, options)
    },
    []
  )

  const notifyError = React.useCallback(
    (message: string, options?: ToastOptions) => {
      return toast.error(message, options)
    },
    []
  )

  return {
    notifySuccess,
    notifyError
  }
}
