import React from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'

export type NavbarProps = never

const Navbar = () => {
  return (
    <div className="navbar flex items-center justify-between px-6 py-5">
      <div />
      <div className="flex items-center gap-2">
        <div>
          <label
            htmlFor="search-memes"
            aria-label="Search"
            className="input input-bordered flex items-center gap-2 input-md min-w-96"
          >
            <input
              type="text"
              id="search-memes"
              className="grow"
              placeholder="Search"
            />
            <MagnifyingGlass />
          </label>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/" className="btn btn-ghost btn-circle">
          <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-8 rounded-full ring ring-offset-2">
              <img
                alt=""
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
