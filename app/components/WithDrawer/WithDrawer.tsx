import React from 'react'
import { Shuffle, Video } from '@phosphor-icons/react'
import { Link, useLocation } from '@tanstack/react-router'

export type WithDrawerProps = {
  children: React.ReactNode
}

const WithDrawer = ({ children }: WithDrawerProps) => {
  const location = useLocation()

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
        <ul className="menu pt-2 w-80 bg-base-100 min-h-full">
          <li>
            <Link to="/dashboard/library">
              <Video className="w-6 h-6" />
              <span>Vidéos</span>
              {location.pathname === '/library' ? (
                <span
                  className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                  aria-hidden="true"
                />
              ) : null}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/random">
              <Shuffle className="w-6 h-6" />
              <span>Aléatoire</span>
              {location.pathname.startsWith('/random') ? (
                <span
                  className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                  aria-hidden="true"
                />
              ) : null}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default WithDrawer
