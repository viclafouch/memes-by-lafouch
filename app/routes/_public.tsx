import Logo from '~/components/icons/Logo'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

const RouteComponent = () => {
  return (
    <div
      style={{
        backgroundImage:
          'url(https://ping.gg/_next/static/media/background.d5ba1ba2.svg)'
      }}
      className="w-full min-h-full bg-no-repeat bg-top bg-gray-900"
    >
      <div className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="relative">
          <div className="sm:pt-2 lg:pt-6">
            <nav
              className="relative flex items-center justify-between"
              aria-label="Global"
            >
              <div className="flex flex-grow items-center gap-x-10">
                <div className="flex w-full items-center justify-between md:w-auto">
                  <Link
                    reloadDocument
                    className="text-white hover:text-pink-300"
                    to="/"
                    aria-label="Logo"
                  >
                    <Logo />
                  </Link>
                </div>
                <div className="flex items-center">
                  <Link className="btn btn-md btn-ghost" to="/">
                    Features
                  </Link>
                  <Link className="btn btn-md btn-ghost" to="/">
                    Pricing
                  </Link>
                </div>
              </div>
              <div className="hidden transition-opacity md:flex md:items-center md:space-x-2">
                <Link className="btn btn-md btn-ghost" to="/">
                  Sign in
                </Link>
                <Link className="btn btn-md btn-secondary" to="/">
                  Start free trial
                </Link>
              </div>
            </nav>
          </div>
        </header>
      </div>
      <Outlet />
    </div>
  )
}

export const Route = createFileRoute('/_public')({
  component: RouteComponent
})
