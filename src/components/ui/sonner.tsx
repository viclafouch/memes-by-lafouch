import type { ToasterProps } from 'sonner'
import { Toaster as Sonner } from 'sonner'
import { useTheme } from '@/lib/theme'

const Toaster = ({ ...props }: ToasterProps) => {
  const { appTheme } = useTheme()

  return (
    <Sonner
      theme={appTheme}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)'
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
