'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { cn } from '@/utils/cn'
import {
  RadioGroup,
  RadioProps,
  useRadio,
  VisuallyHidden
} from '@nextui-org/react'
import { Monitor, Moon, SunDim } from '@phosphor-icons/react'

type ThemeRadioItemProps = RadioProps & { icon: React.ReactNode }

const ThemeRadioItem = ({ icon, ...restRadioProps }: ThemeRadioItemProps) => {
  const {
    Component,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps
  } = useRadio(restRadioProps)

  const wrapperProps = getWrapperProps()

  return (
    <Component {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...wrapperProps}
        className={cn(
          wrapperProps?.className,
          'pointer-events-none h-8 w-8 rounded-full border-black border-opacity-10 ring-0 transition-transform group-data-[pressed=true]:scale-90',
          {
            'bg-default-200 dark:bg-default-100': isSelected
          }
        )}
      >
        {icon}
      </div>
    </Component>
  )
}

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  return (
    <RadioGroup
      aria-label="Sélectionner un thème"
      className="gap-0 items-center"
      value={theme}
      onValueChange={setTheme}
      orientation="horizontal"
    >
      <ThemeRadioItem icon={<Moon size={20} />} value="dark" />
      <ThemeRadioItem icon={<SunDim size={20} />} value="light" />
      <ThemeRadioItem icon={<Monitor size={20} />} value="system" />
    </RadioGroup>
  )
}

export default ThemeSwitcher
