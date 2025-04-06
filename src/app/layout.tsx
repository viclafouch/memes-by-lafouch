import { Inter } from 'next/font/google'
import clsx from 'clsx'
import { Providers } from '@/app/providers'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import OnlyPortrait from '@/components/OnlyPortrait'
import TailwindIndicator from '@/components/TailwindIndicator/TailwindIndicator'
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
            <div className="flex flex-col min-h-screen has-[#homepage]:grandient-memes">
              <Nav />
              <div className="flex flex-col grow">{children}</div>
              <Footer />
            </div>
          </Providers>
        </OnlyPortrait>
        <TailwindIndicator />
      </body>
    </html>
  )
}

export default RootLayout
