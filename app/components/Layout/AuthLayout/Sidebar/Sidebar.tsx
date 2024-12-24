import React from 'react'
import Logo from '~/components/icons/Logo'
import { Shuffle, Video } from '@phosphor-icons/react'
import { Link, useLocation } from '@tanstack/react-router'

export type SidebarProps = never

const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="drawer-side">
      <div className="w-80 min-h-full flex flex-col bg-base-100 border-r border-base-300">
        <div className="p-6">
          <Logo />
        </div>
        <ul className="menu pt-2 w-full">
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

export default Sidebar
