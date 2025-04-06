import React from 'react'
import type { ToastOptions } from 'react-toastify'
import { toast } from 'react-toastify'

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
