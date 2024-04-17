'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useSpring
} from 'framer-motion'
import { useInterval } from 'usehooks-ts'
import { useProgressBar } from '@/hooks/useProgressBar'
import { randomNumber } from '@/utils/number'

type ProgressState = 'initial' | 'in-progress' | 'completing' | 'complete'

function useProgress() {
  const [state, setState] = React.useState<ProgressState>('initial')

  const value = useSpring(0, {
    damping: 25,
    mass: 0.5,
    stiffness: 300,
    restDelta: 0.1
  })

  useInterval(
    () => {
      // If we start progress but the bar is currently complete, reset it first.
      if (value.get() === 100) {
        value.jump(0)
      }

      const current = value.get()

      let diff

      if (current === 0) {
        diff = 15
      } else if (current < 50) {
        diff = randomNumber(1, 10)
      } else {
        diff = randomNumber(1, 5)
      }

      value.set(Math.min(current + diff, 99))
    },
    state === 'in-progress' ? 750 : null
  )

  React.useEffect(() => {
    if (state === 'initial') {
      value.jump(0)
    } else if (state === 'completing') {
      value.set(100)
    }

    return value.on('change', (latest) => {
      if (latest === 100) {
        setState('complete')
      }
    })
  }, [value, state])

  function reset() {
    setState('initial')
  }

  function start() {
    setState('in-progress')
  }

  function done() {
    setState((prevState) => {
      return prevState === 'initial' || prevState === 'in-progress'
        ? 'completing'
        : prevState
    })
  }

  return { state, value, start, done, reset }
}

export const ProgressBarContext = React.createContext<ReturnType<
  typeof useProgress
> | null>(null)

export type ProgressBarProps = {
  className: string
  children: React.ReactNode
}

const ProgressBar = ({ className, children }: ProgressBarProps) => {
  const progress = useProgress()
  const width = useMotionTemplate`${progress.value}%`

  return (
    <ProgressBarContext.Provider value={progress}>
      <AnimatePresence onExitComplete={progress.reset}>
        {progress.state !== 'complete' ? (
          <motion.div
            style={{ width }}
            exit={{ opacity: 0 }}
            className={className}
          />
        ) : null}
      </AnimatePresence>
      {children}
    </ProgressBarContext.Provider>
  )
}

export const ProgressBarLink = React.forwardRef(
  (
    {
      href,
      children = null,
      ...restLinkProps
    }: React.ComponentProps<typeof Link>,
    ref: React.LegacyRef<HTMLAnchorElement> | undefined
  ) => {
    const progress = useProgressBar()
    const router = useRouter()

    return (
      <Link
        ref={ref}
        href={href}
        onClick={(event) => {
          event.preventDefault()
          progress.start()

          React.startTransition(() => {
            progress.done()
            router.push(href.toString())
          })
        }}
        {...restLinkProps}
      >
        {children}
      </Link>
    )
  }
)

export default ProgressBar
