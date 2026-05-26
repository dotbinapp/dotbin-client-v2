import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeModeContext, type ThemeMode, type ThemeModeContextValue } from '../store'

interface ThemeModeProviderProps {
  children: ReactNode
}

const THEME_MODE_STORAGE_KEY = 'dotbin-theme-mode'
const DARK_THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)'

function ThemeModeProvider({ children }: Readonly<ThemeModeProviderProps>) {
  const [pinnedThemeMode, setPinnedThemeMode] = useState<ThemeMode | null>(() => getPinnedThemeMode())
  const [systemThemeMode, setSystemThemeMode] = useState<ThemeMode>(() => getSystemThemeMode())
  const themeMode = pinnedThemeMode ?? systemThemeMode

  useEffect(() => {
    applyThemeMode(themeMode)
  }, [themeMode])

  useEffect(() => {
    const mediaQuery = window.matchMedia(DARK_THEME_MEDIA_QUERY)
    const handleSystemThemeModeChange = (event: MediaQueryListEvent) => {
      setSystemThemeMode(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleSystemThemeModeChange)

    return () => mediaQuery.removeEventListener('change', handleSystemThemeModeChange)
  }, [])

  const contextValue = useMemo<ThemeModeContextValue>(() => ({
    themeMode,
    setThemeMode: (nextThemeMode) => {
      localStorage.setItem(THEME_MODE_STORAGE_KEY, nextThemeMode)
      setPinnedThemeMode(nextThemeMode)
    },
  }), [themeMode])

  return <ThemeModeContext value={contextValue}>{children}</ThemeModeContext>
}

function getPinnedThemeMode(): ThemeMode | null {
  const storedThemeMode = localStorage.getItem(THEME_MODE_STORAGE_KEY)

  if (storedThemeMode === 'light' || storedThemeMode === 'dark') {
    return storedThemeMode
  }

  return null
}

function getSystemThemeMode(): ThemeMode {
  return window.matchMedia(DARK_THEME_MEDIA_QUERY).matches ? 'dark' : 'light'
}

function applyThemeMode(themeMode: ThemeMode) {
  const root = document.documentElement
  const colorSchemeMeta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')

  root.classList.toggle('dark', themeMode === 'dark')
  root.dataset.theme = themeMode
  colorSchemeMeta?.setAttribute('content', themeMode)
}

export default ThemeModeProvider
