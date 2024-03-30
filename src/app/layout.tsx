import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import clsx from 'clsx'
import { Providers } from '@/app/providers'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import './globals.css'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

const inter = Inter({ subsets: ['latin'] })

const RootLayout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="en" className="light">
      <body
        className={clsx(
          inter.className,
          'h-screen',
          'w-screen',
          'text-foreground',
          'bg-background'
        )}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Nav />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
