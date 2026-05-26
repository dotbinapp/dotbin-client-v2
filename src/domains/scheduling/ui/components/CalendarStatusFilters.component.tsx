import { X } from 'lucide-react'
import { Pill } from '@shared/ui/atoms'
import { CALENDAR_QUICK_STATUS_FILTERS } from '../../model/calendar.constants'
import type { AppointmentStatus } from '../../model/scheduling.types'
import { getCalendarStatusPresentation } from '../styles/calendarStatus.styles'

interface CalendarStatusFiltersProps {
  counts: Map<AppointmentStatus, number>
  onClear: () => void
  onToggle: (status: AppointmentStatus) => void
  selected: AppointmentStatus[]
}

function CalendarStatusFilters({ counts, onClear, onToggle, selected }: Readonly<CalendarStatusFiltersProps>) {
  return (
    <div className="shrink-0 border-b border-slate-200/70 bg-slate-50/90 px-2 py-1.5 backdrop-blur-sm md:px-3">
      <div className="flex items-center gap-2 overflow-x-auto px-1 py-1.5 custom-scrollbar" aria-label="Filtros rápidos por estado">
        {CALENDAR_QUICK_STATUS_FILTERS.map((status) => {
          const active = selected.includes(status)
          const count = counts.get(status) ?? 0
          const presentation = getCalendarStatusPresentation(status)

          return (
            <Pill
              key={status}
              active={active}
              activeClassName={presentation.pillActiveClassName}
              aria-pressed={active}
              count={count}
              dotClassName={presentation.dotClassName}
              inactiveClassName={presentation.pillInactiveClassName}
              onClick={() => onToggle(status)}
            >
              {presentation.label}
            </Pill>
          )
        })}

        {selected.length > 0 ? (
          <button
            type="button"
            aria-label="Limpiar filtros de estado"
            onClick={onClear}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default CalendarStatusFilters
