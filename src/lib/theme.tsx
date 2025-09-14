import React from 'react'
import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'

export type UserTheme = 'light' | 'dark' | 'system'
export type AppTheme = Exclude<UserTheme, 'system'>

const themeCookie = 'ui-theme'
const themes = ['light', 'dark', 'system'] as const satisfies UserTheme[]

export const getStoredTheme = createServerFn().handler(async () => {
  return (getCookie(themeCookie) || 'system') as UserTheme
})

export const setStoredTheme = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    if (typeof data !== 'string' || !themes.includes(data as UserTheme)) {
      throw new Error('Invalid theme')
    }

    return data as UserTheme
  })
  .handler(({ data }) => {
    setCookie(themeCookie, data)
  })

function getSystemTheme(): AppTheme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function handleThemeChange(theme: UserTheme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  const newTheme = theme === 'system' ? getSystemTheme() : theme
  root.classList.add(newTheme)
}

function setupPreferredListener() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const handler = () => {
    return handleThemeChange('system')
  }

  mediaQuery.addEventListener('change', handler)

  return () => {
    return mediaQuery.removeEventListener('change', handler)
  }
}

type ThemeContextProps = {
  userTheme: UserTheme
  appTheme: AppTheme
  setTheme: (theme: UserTheme) => void
}
const ThemeContext = React.createContext<ThemeContextProps | undefined>(
  undefined
)

type ThemeProviderProps = {
  children: React.ReactNode
  initialTheme: UserTheme
}

export const ThemeProvider = ({
  children,
  initialTheme
}: ThemeProviderProps) => {
  const [userTheme, setUserTheme] = React.useState<UserTheme>(initialTheme)

  React.useEffect(() => {
    handleThemeChange(userTheme)

    if (userTheme === 'system') {
      return setupPreferredListener()
    }

    return () => {}
  }, [userTheme])

  const appTheme = userTheme === 'system' ? getSystemTheme() : userTheme

  const setTheme = React.useCallback((newUserTheme: UserTheme) => {
    setUserTheme(newUserTheme)
    setStoredTheme({ data: newUserTheme })
  }, [])

  const value = React.useMemo(() => {
    return { userTheme, appTheme, setTheme }
  }, [userTheme, appTheme, setTheme])

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export const useTheme = () => {
  const context = React.use(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
