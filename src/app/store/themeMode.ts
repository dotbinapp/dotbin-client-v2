import { createContext } from 'react'

export type ThemeMode = 'light' | 'dark'

export interface ThemeModeContextValue {
  themeMode: ThemeMode
  setThemeMode: (themeMode: ThemeMode) => void
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)
