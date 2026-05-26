import { useContext } from 'react'
import { ThemeModeContext } from '@app/store'

export function useThemeMode() {
  const contextValue = useContext(ThemeModeContext)

  if (!contextValue) {
    throw new Error('useThemeMode must be used within ThemeModeProvider')
  }

  return contextValue
}
