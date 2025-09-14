import { Loader2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'

export const DefaultLoading = ({
  className,
  ...restProps
}: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'mx-auto flex flex-col items-center justify-center',
        className
      )}
      {...restProps}
    >
      <Loader2Icon className="animate-spin text-primary" />
      <p className="mt-2 text-muted-foreground text-sm">Chargement...</p>
    </div>
  )
}
