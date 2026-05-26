import { Moon, Sun } from 'lucide-react'

function ThemeModeSwitch() {
  return (
    <div
      aria-label="Selector visual de tema"
      className="inline-flex h-9 items-center rounded-full border border-slate-200/80 bg-white/65 p-1 shadow-sm shadow-slate-900/5"
      role="group"
    >
      <button
        aria-label="Tema oscuro"
        aria-pressed="true"
        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white shadow-sm transition-transform hover:scale-105"
        type="button"
      >
        <Moon aria-hidden="true" size={14} strokeWidth={2.2} />
      </button>

      <button
        aria-label="Tema claro"
        aria-pressed="false"
        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:text-slate-700"
        type="button"
      >
        <Sun aria-hidden="true" size={14} strokeWidth={2.2} />
      </button>
    </div>
  )
}

export default ThemeModeSwitch
