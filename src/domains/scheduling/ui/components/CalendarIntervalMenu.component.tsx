import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'
import { CALENDAR_SLOT_INTERVALS } from '../../model/calendar.constants'
import type { CalendarSlotIntervalMinutes } from '../../model/scheduling.types'

interface CalendarIntervalMenuProps {
  disabled?: boolean
  intervalMinutes: CalendarSlotIntervalMinutes
  isOpen: boolean
  onChange: (minutes: CalendarSlotIntervalMinutes) => void
  onClose: () => void
  onToggle: (rect: DOMRect) => void
  triggerRect: DOMRect | null
}

function CalendarIntervalMenu({ disabled = false, intervalMinutes, isOpen, onChange, onClose, onToggle, triggerRect }: Readonly<CalendarIntervalMenuProps>) {
  return (
    <>
      <button
        type="button"
        data-week-interval-trigger
        disabled={disabled}
        onClick={(event) => onToggle(event.currentTarget.getBoundingClientRect())}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Elegir intervalo de la grilla"
        className="flex flex-col items-center justify-center gap-0.5 border-r border-slate-200/50 p-2 text-center text-slate-600 transition-colors hover:bg-slate-100/70 disabled:pointer-events-none disabled:opacity-50 md:p-3"
      >
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 md:text-[11px]">Hora</span>
        <span className="flex items-center gap-0.5 text-[10px] font-bold text-primary-700 md:text-xs">
          {intervalMinutes} min
          <ChevronDown className="size-3 shrink-0 opacity-70 md:size-3.5" aria-hidden="true" />
        </span>
      </button>

      {isOpen && typeof document !== 'undefined'
        ? createPortal(
          <div
            data-week-interval-menu
            className="fixed z-50 rounded-xl border border-slate-200/80 bg-white py-1 shadow-lg shadow-slate-200/50"
            style={getIntervalMenuStyle(triggerRect)}
            role="listbox"
            aria-label="Intervalo de la grilla"
          >
            {CALENDAR_SLOT_INTERVALS.map((minutes) => (
              <button
                key={minutes}
                type="button"
                role="option"
                aria-selected={minutes === intervalMinutes}
                className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors ${minutes === intervalMinutes ? 'bg-primary-50/80 font-semibold text-primary-800' : 'text-slate-700 hover:bg-slate-50'}`}
                onClick={(event) => {
                  event.stopPropagation()
                  onChange(minutes)
                  onClose()
                }}
              >
                {minutes} min
              </button>
            ))}
          </div>,
          document.body,
        )
        : null}
    </>
  )
}

function getIntervalMenuStyle(rect: DOMRect | null) {
  if (!rect) return { left: 8, minWidth: 140, top: 8 }

  const width = Math.max(rect.width, 140)
  const left = Math.min(Math.max(rect.left, 8), window.innerWidth - width - 8)
  const top = rect.bottom + 6

  return { left, minWidth: width, top }
}

export default CalendarIntervalMenu
