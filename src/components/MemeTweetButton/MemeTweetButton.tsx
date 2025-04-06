import React from 'react'
import type { ButtonProps } from '@heroui/react'
import { Button } from '@heroui/react'
import { XLogo } from '@phosphor-icons/react/dist/ssr'
import type { Meme } from '@prisma/client'

export type MemeTweetButtonProps = {
  tweetUrl: NonNullable<Meme['tweetUrl']>
  IconProps?: React.ComponentProps<typeof XLogo>
} & ButtonProps

const MemeTweetButton = ({
  tweetUrl,
  IconProps = undefined,
  ...restButtonProps
}: MemeTweetButtonProps) => {
  return (
    <Button
      as="a"
      href={tweetUrl}
      target="_blank"
      size="sm"
      isIconOnly
      className="bg-black text-white"
      aria-label="Visiter le status Twitter"
      {...restButtonProps}
    >
      <XLogo size={20} {...IconProps} />
    </Button>
  )
}

export default MemeTweetButton
