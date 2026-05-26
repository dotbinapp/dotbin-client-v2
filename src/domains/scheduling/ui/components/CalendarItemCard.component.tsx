import type { PositionedCalendarItem } from '../../model/scheduling.types'
import { getTimeFromIso } from '../../utils/calendarTime.utils'
import { getCalendarStatusPresentation } from '../styles/calendarStatus.styles'

interface CalendarItemCardProps {
  onOpen: () => void
  positionedItem: PositionedCalendarItem
  timezone: string
}

function CalendarItemCard({ onOpen, positionedItem, timezone }: Readonly<CalendarItemCardProps>) {
  const { item, height, left, top, width } = positionedItem
  const isBlock = item.type === 'BLOCK'
  const presentation = getCalendarStatusPresentation(isBlock ? 'BLOCKED' : item.status)

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`absolute pointer-events-auto overflow-hidden rounded-lg border px-2 py-1 text-left text-[11px] shadow-sm transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60 ${presentation.cardClassName}`}
      style={{ height, left: `${left}%`, top, width: `${width}%` }}
      aria-label={isBlock ? 'Bloqueo de horario' : 'Turno agendado'}
    >
      <span className="block truncate font-bold leading-tight">
        {isBlock ? item.blockReason || 'Horario bloqueado' : item.patientFullName || 'Turno sin paciente'}
      </span>
      <span className="mt-0.5 block truncate text-[10px] font-semibold opacity-75">
        {getTimeFromIso(item.start, timezone)} · {item.durationMinutes} min
      </span>
    </button>
  )
}

export default CalendarItemCard
