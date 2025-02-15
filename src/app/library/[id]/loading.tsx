import React from 'react'
import { CircularProgress } from '@heroui/react'

const Loading = () => {
  return (
    <div className="flex h-full items-center justify-center grow">
      <CircularProgress aria-label="Récupération du mème..." size="lg" />
    </div>
  )
}

export default Loading
