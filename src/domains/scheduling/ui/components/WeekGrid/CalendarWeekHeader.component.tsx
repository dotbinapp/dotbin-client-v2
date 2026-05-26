import type { CSSProperties } from 'react'
import CalendarIntervalMenu from '../CalendarIntervalMenu.component'
import { SHORT_WEEKDAY_LABELS } from '../../../model/calendar.constants'
import type { CalendarSlotIntervalMinutes, CalendarWeekColumn } from '../../../model/scheduling.types'

interface CalendarWeekHeaderProps {
  disabled: boolean
  gridStyle: CSSProperties
  intervalMenuRect: DOMRect | null
  intervalMinutes: CalendarSlotIntervalMinutes
  onIntervalChange: (minutes: CalendarSlotIntervalMinutes) => void
  onIntervalClose: () => void
  onIntervalToggle: (rect: DOMRect) => void
  weekColumns: CalendarWeekColumn[]
}

function CalendarWeekHeader({
  disabled,
  gridStyle,
  intervalMenuRect,
  intervalMinutes,
  onIntervalChange,
  onIntervalClose,
  onIntervalToggle,
  weekColumns,
}: Readonly<CalendarWeekHeaderProps>) {
  return (
    <div className="sticky top-0 z-30 grid border-b border-slate-200/50 bg-slate-50/80 backdrop-blur-md" style={gridStyle}>
      <CalendarIntervalMenu
        disabled={disabled}
        intervalMinutes={intervalMinutes}
        isOpen={Boolean(intervalMenuRect)}
        triggerRect={intervalMenuRect}
        onChange={onIntervalChange}
        onClose={onIntervalClose}
        onToggle={onIntervalToggle}
      />

      {weekColumns.map(({ closed, day, dayKey, isToday }) => (
        <div
          key={dayKey}
          className={`border-r border-slate-200/50 p-1.5 text-center transition-colors md:p-3 ${isToday ? 'bg-primary-50/40' : ''} ${closed ? 'bg-slate-100' : ''}`}
        >
          <div className={`text-[9px] font-bold uppercase tracking-wider md:text-[10px] ${closed ? 'text-slate-400' : 'text-slate-500'}`}>
            {SHORT_WEEKDAY_LABELS[day.getDay()]}
          </div>
          <div className={`text-base md:text-lg ${isToday ? 'font-bold text-primary-600' : closed ? 'text-slate-400' : 'text-slate-700'}`}>
            {day.getDate()}
          </div>
        </div>
      ))}
    </div>
  )
}

export default CalendarWeekHeader
