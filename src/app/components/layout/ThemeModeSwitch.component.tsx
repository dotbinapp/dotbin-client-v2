import { Moon, Sun } from 'lucide-react'
import { useThemeMode } from '@app/providers'
import { composeClassName } from '@shared/ui/utils/className.utils'

const THEME_SWITCH_BUTTON_BASE_CLASS = 'inline-flex size-7 cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:scale-105'
const THEME_SWITCH_BUTTON_ACTIVE_CLASS = 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950'
const THEME_SWITCH_BUTTON_INACTIVE_CLASS = 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200'

function ThemeModeSwitch() {
  const { themeMode, setThemeMode } = useThemeMode()

  return (
    <div
      aria-label="Selector visual de tema"
      className="inline-flex h-9 items-center rounded-full border border-slate-200/80 bg-white/65 p-1 shadow-sm shadow-slate-900/5 dark:border-slate-700/70 dark:bg-slate-900/65 dark:shadow-black/20"
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
