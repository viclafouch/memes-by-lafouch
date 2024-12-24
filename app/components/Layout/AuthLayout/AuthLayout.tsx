import React from 'react'
import Navbar from '~/components/Layout/AuthLayout/Navbar'
import Sidebar from '~/components/Layout/AuthLayout/Sidebar'

export type AuthLayoutProps = {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content bg-base-200 container mx-auto flex flex-col">
        <div className="sticky top-0 z-50 bg-base-100/80 backdrop-blur shadow-sm">
          <Navbar />
        </div>
        <div className="flex-1 px-4 bg-base-100 isolate">{children}</div>
      </div>
      <Sidebar />
    </div>
  )
}

export default AuthLayout
