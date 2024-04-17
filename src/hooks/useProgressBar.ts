import React from 'react'
import { ProgressBarContext } from '@/components/ProgressBar'

export function useProgressBar() {
  const progress = React.useContext(ProgressBarContext)

  if (progress === null) {
    throw new Error('Need to be inside provider')
  }

  return progress
}
