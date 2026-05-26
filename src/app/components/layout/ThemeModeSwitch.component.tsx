import { Moon, Sun } from 'lucide-react'
import { useThemeMode } from '@app/providers'
import { themeClass } from '@shared/styles/theme.styles'
import { composeClassName } from '@shared/ui/utils/className.utils'

const THEME_SWITCH_BUTTON_BASE_CLASS = 'inline-flex size-7 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:scale-105'
const THEME_SWITCH_BUTTON_ACTIVE_CLASS = 'bg-ui-text text-ui-surface shadow-sm'
const THEME_SWITCH_BUTTON_INACTIVE_CLASS = `${themeClass.text.subtle} hover:text-ui-text`

function ThemeModeSwitch() {
  const { themeMode, setThemeMode } = useThemeMode()

  return (
    <div
      aria-label="Selector visual de tema"
      className={`inline-flex h-9 items-center rounded-full p-1 shadow-sm shadow-slate-900/5 ${themeClass.surface.default}`}
      role="group"
    >
      <button
        aria-label="Tema oscuro"
        aria-pressed={themeMode === 'dark'}
        className={getThemeSwitchButtonClassName(themeMode === 'dark')}
        onClick={() => setThemeMode('dark')}
        type="button"
      >
        <Moon aria-hidden="true" size={14} strokeWidth={2.2} />
      </button>

      <button
        aria-label="Tema claro"
        aria-pressed={themeMode === 'light'}
        className={getThemeSwitchButtonClassName(themeMode === 'light')}
        onClick={() => setThemeMode('light')}
        type="button"
      >
        <Sun aria-hidden="true" size={14} strokeWidth={2.2} />
      </button>
    </div>
  )
}

function getThemeSwitchButtonClassName(isActive: boolean) {
  return composeClassName(
    THEME_SWITCH_BUTTON_BASE_CLASS,
    isActive ? THEME_SWITCH_BUTTON_ACTIVE_CLASS : THEME_SWITCH_BUTTON_INACTIVE_CLASS,
  )
}

export default ThemeModeSwitch
