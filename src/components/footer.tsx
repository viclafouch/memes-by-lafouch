import { Link } from '@tanstack/react-router'

export const Footer = () => {
  return (
    <footer className="border-t bg-background/40 relative">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center flex-wrap gap-x-8 gap-y-6">
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            À propos
          </Link>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Confidentialité
          </Link>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Conditions
          </Link>
        </div>
      </div>
    </footer>
  )
}
