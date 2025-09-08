export type WithDialog<T> = T & {
  open: boolean
  onOpenChange: (open: boolean) => void
}
