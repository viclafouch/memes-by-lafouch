import { Loader2Icon } from 'lucide-react'

export const DefaultLoading = () => {
  return (
    <div className="mx-auto mt-8 flex flex-col items-center justify-center">
      <Loader2Icon className="animate-spin" />
      <p className="mt-2 text-muted-foreground text-sm">Loading...</p>
    </div>
  )
}
