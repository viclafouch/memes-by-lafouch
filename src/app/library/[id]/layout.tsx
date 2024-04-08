import React from 'react'
import Container from '@/components/Container'

const Layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <Container>
      <div className="py-10 lg:h-[calc(100vh_-_60px)]">{children}</div>
    </Container>
  )
}

export default Layout
