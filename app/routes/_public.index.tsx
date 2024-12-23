import FakeBrowser from '~/components/FakeBrowser'
import { createFileRoute, Link } from '@tanstack/react-router'

const Home = () => {
  Route.useLoaderData()

  return (
    <main className="w-full overflow-x-hidden px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:gap-8 items-center">
        <div className="mx-auto max-w-md sm:max-w-2xl sm:px-6 sm:text-center lg:flex lg:items-center lg:pl-0 lg:text-left">
          <div className="lg:py-24">
            <h1 className="font-title text-center text-[clamp(2rem,6vw,4.2rem)] font-black leading-[1.1] [word-break:auto-phrase] xl:w-[115%] xl:text-start [:root[dir=rtl]_&]:leading-[1.35]">
              <span className="[&::selection]:text-base-content brightness-150 contrast-150 [&::selection]:bg-blue-700/20">
                The most popular
              </span>
              <br />
              <span className="inline-grid">
                <span
                  className="pointer-events-none col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text blur-xl [-webkit-text-fill-color:transparent] [transform:translate3d(0,0,0)] before:content-[attr(data-text)] [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]"
                  aria-hidden="true"
                  data-text="mème studio"
                />
                <span className="[&amp;::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&amp;::selection]:bg-blue-700/20 [@supports(color:oklch(0%_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]">
                  mème studio
                </span>
              </span>
              <br />
              <span className="[&::selection]:text-base-content brightness-150 contrast-150 [&::selection]:bg-blue-700/20">
                for everyone
              </span>
            </h1>
            <p className="py-4 text-base text-base-content/70 sm:text-xl lg:text-lg xl:text-xl">
              Higher quality, lower latency, creator focused video calls. Ping
              is the best way to bring your guests into OBS.
            </p>
            <div className="mt-2">
              <Link to="/" className="btn btn-secondary btn-lg">
                Start your free trial now
              </Link>
            </div>
          </div>
        </div>
        <div className="h-[80%]">
          <FakeBrowser />
        </div>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/_public/')({
  component: Home
})
