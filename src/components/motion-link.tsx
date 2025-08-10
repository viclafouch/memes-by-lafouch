import * as React from 'react'
import { type HTMLMotionProps, motion } from 'motion/react'
import { createLink } from '@tanstack/react-router'

const MotionLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  HTMLMotionProps<'a'>
>((props, ref) => {
  return <motion.a {...props} ref={ref} />
})

export const MotionLink = createLink(MotionLinkComponent)
