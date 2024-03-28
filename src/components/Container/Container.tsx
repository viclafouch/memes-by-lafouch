import React from 'react'
import { cn } from '@/utils/cn'

export type ContainerProps = React.ComponentPropsWithoutRef<'div'>

const Container = ({ className, ...restDivProps }: ContainerProps) => {
  return (
    <div
      className={cn('container px-4 mx-auto', className)}
      {...restDivProps}
    />
  )
}

export default Container
