import React from 'react'
import { cn } from '~/utils/cn'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'

export type NavbarProps = never

const Navbar = () => {
  const routeSearch = useSearch({ strict: false })
  const navigate = useNavigate()
  const [currentQuery, setCurrentQuery] = React.useState(
    routeSearch.query ?? ''
  )
  const inputRef = React.useRef<HTMLInputElement>(null!)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuery(event.target.value)
  }

  const clearQuery = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setCurrentQuery('')
    inputRef.current.focus()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (currentQuery === routeSearch.query) {
      return
    }

    navigate({
      to: '/dashboard/library',
      replace: true,
      resetScroll: true,
      search: {
        query: currentQuery,
        page: 1
      }
    })
  }

  return (
    <div className="navbar flex items-center justify-between px-6 py-5">
      <div />
      <div className="flex items-center gap-2">
        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="search-memes"
            aria-label="Search"
            className="input input-bordered flex items-center gap-2 input-md min-w-96"
          >
            <input
              type="text"
              id="search-memes"
              className="grow peer"
              name="search-query"
              ref={inputRef}
              onChange={handleChange}
              value={currentQuery}
              placeholder="Rechercher un mème"
            />
            <div className="flex items-center">
              <button
                onClick={clearQuery}
                type="button"
                className={cn('btn btn-ghost btn-circle btn-sm', {
                  invisible: currentQuery === ''
                })}
              >
                <X />
              </button>
              <button type="submit" className="btn btn-ghost btn-circle btn-sm">
                <MagnifyingGlass />
              </button>
            </div>
          </label>
        </form>
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
