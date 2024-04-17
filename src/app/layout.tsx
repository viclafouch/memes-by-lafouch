import { Inter } from 'next/font/google'
import clsx from 'clsx'
import { Providers } from '@/app/providers'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import OnlyPortrait from '@/components/OnlyPortrait'
import { ProgressBar } from '@/components/ProgressBar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const RootLayout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={clsx(
          inter.className,
          'h-screen',
          'w-screen',
          'text-foreground',
          'bg-background'
        )}
      >
        <OnlyPortrait>
          <Providers>
            <ProgressBar className="fixed top-0 h-1 shadow-lg shadow-sky-500/20 bg-sky-500 z-50">
              <div className="flex flex-col min-h-screen has-[#homepage]:grandient-memes">
                <Nav />
                <div className="grow">{children}</div>
                <Footer />
              </div>
            </ProgressBar>
          </Providers>
        </OnlyPortrait>
      </body>
    </html>
  )
}

export default RootLayout
