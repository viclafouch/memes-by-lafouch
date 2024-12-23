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
                  >
                    <span className="sr-only">Ping</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 260 150"
                      fill="currentColor"
                      className="h-10 sm:h-12"
                    >
                      <path d="M231.53,25.79A16.71,16.71,0,0,1,248.24,42.5v65a16.71,16.71,0,0,1-16.71,16.71H134.64a15.5,15.5,0,0,1-31,0H28.47A16.71,16.71,0,0,1,11.76,107.5v-65A16.71,16.71,0,0,1,28.47,25.79H231.53m0-9.76H28.47A26.49,26.49,0,0,0,2,42.5v65A26.49,26.49,0,0,0,28.47,134H96a25.25,25.25,0,0,0,46.33,0h89.23A26.49,26.49,0,0,0,258,107.5v-65A26.49,26.49,0,0,0,231.53,16ZM102.8,98.32a8.84,8.84,0,0,1-17.68,0V68.67a8.84,8.84,0,1,1,17.68,0Zm64.92-1.53a10.38,10.38,0,0,1-10.41,10.33h-.92a10.36,10.36,0,0,1-8.35-4.21l-.11-.16L128,73.93v50a8.84,8.84,0,0,1-17.68,0V52.52a10.39,10.39,0,0,1,10.34-10.41h1a10.6,10.6,0,0,1,8.44,4.37l.18.24L150,75.3v-7a8.84,8.84,0,1,1,17.68,0Zm63.81-3.68a10.49,10.49,0,0,1-5.9,9.55,44.41,44.41,0,0,1-19.93,4.84c-19,0-32.27-13.49-32.27-32.81,0-19.1,13.48-33,32-33A38.68,38.68,0,0,1,227.34,48a8.6,8.6,0,0,1,4.12,7.34,8.44,8.44,0,0,1-8.57,8.49,8.89,8.89,0,0,1-4-1l-.33-.18a22.67,22.67,0,0,0-12.31-3.55c-9.48,0-15.14,5.8-15.14,15.52s6,15.53,15.52,15.53a22.73,22.73,0,0,0,8.08-1.45V83.64h-7.31a8.49,8.49,0,1,1,0-17H222.5a8.93,8.93,0,0,1,9,9ZM74.62,49.56C70,44.87,63.34,42.5,54.76,42.5H37.27a8.84,8.84,0,0,0-8.8,8.87V98.32a8.84,8.84,0,0,0,17.67,0V87.25h8.62c8.58,0,15.26-2.38,19.87-7.07a21.62,21.62,0,0,0,6-15.31A21.6,21.6,0,0,0,74.62,49.56ZM53.85,71.8H46.14V58h7.71c8.6,0,8.6,4.68,8.6,6.92S62.45,71.8,53.85,71.8Z" />
                    </svg>
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
