/* eslint-disable id-length */
import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type IconButtonStarsProps = React.ComponentProps<typeof Button> & {
  icon: React.ElementType
  active?: boolean
  className?: string
  onlyStars?: boolean
}

const color = [255, 255, 255] as const

const IconButtonStars = ({
  icon: Icon,
  className,
  active = false,
  onlyStars = false,
  ...props
}: IconButtonStarsProps) => {
  return (
    <Button
      data-slot="icon-button"
      className={cn(`group/icon-button relative`, className)}
      size="icon"
      variant="ghost"
      style={
        {
          '--icon-button-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        } as React.CSSProperties
      }
      {...props}
    >
      <Icon
        className={
          active && !onlyStars
            ? 'fill-[var(--icon-button-color)]'
            : 'fill-transparent'
        }
      />
      <AnimatePresence initial={false}>
        {active ? (
          <>
            {[...Array(6)].map((_, index) => {
              return (
                <motion.div
                  key={index}
                  className="absolute w-1 h-1 rounded-full bg-[var(--icon-button-color)]"
                  initial={{ x: '50%', y: '50%', scale: 0, opacity: 0 }}
                  animate={{
                    x: `calc(50% + ${Math.cos((index * Math.PI) / 3) * 30}px)`,
                    y: `calc(50% + ${Math.sin((index * Math.PI) / 3) * 30}px)`,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.05,
                    ease: 'easeOut'
                  }}
                />
              )
            })}
          </>
        ) : null}
      </AnimatePresence>
    </Button>
  )
}

export { IconButtonStars, type IconButtonStarsProps }
