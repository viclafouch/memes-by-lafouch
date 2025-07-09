import React from 'react'
import { Loader2Icon } from 'lucide-react'
import { useSpinDelay } from 'spin-delay'
import { Button } from '@/components/ui/button'

export const LoadingButton = ({
  children,
  disabled,
  isLoading = false,
  ...props
}: React.ComponentProps<typeof Button> & { isLoading: boolean }) => {
  const showSpinner = useSpinDelay(isLoading, { delay: 500, minDuration: 200 })

  return (
    <Button {...props} disabled={disabled || isLoading}>
      {showSpinner ? (
        <>
          <Loader2Icon className="animate-spin" />
          Chargement...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
