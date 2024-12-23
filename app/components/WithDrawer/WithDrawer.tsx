import React from 'react'
import { Video } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'

export type WithDrawerProps = {
  children: React.ReactNode
}

const WithDrawer = ({ children }: WithDrawerProps) => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content bg-base-200 container px-4 mx-auto py-10 flex flex-col">
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <ul className="menu pt-2 w-80 bg-base-100 min-h-full text-base-content">
          <li>
            <Link to="/library">
              <Video className="w-6 h-6" />
              <span>Vidéos</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default WithDrawer
