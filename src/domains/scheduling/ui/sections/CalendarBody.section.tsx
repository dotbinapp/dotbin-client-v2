import { DEFAULT_CALENDAR_TIMEZONE } from '../../model/calendar.constants'
import type { CalendarItem, CalendarSlotIntent } from '../../model/scheduling.types'
import { CalendarWeekGrid } from '../components'

const EMPTY_CALENDAR_ITEMS: CalendarItem[] = []

interface CalendarBodyProps {
  onSlotIntent: (day: Date, startTime: string, intent: CalendarSlotIntent) => void
  selectedDate: string
}

function CalendarBody({ onSlotIntent, selectedDate }: Readonly<CalendarBodyProps>) {
  const selectedDateValue = new Date(`${selectedDate}T00:00:00`)

  return (
    <section className="mt-4 min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-label="Calendario semanal">
      <CalendarWeekGrid
        canEdit
        items={EMPTY_CALENDAR_ITEMS}
        selectedDate={selectedDateValue}
        timezone={DEFAULT_CALENDAR_TIMEZONE}
        onSlotIntent={onSlotIntent}
      />
    </section>
  )
}

export default CalendarBody
