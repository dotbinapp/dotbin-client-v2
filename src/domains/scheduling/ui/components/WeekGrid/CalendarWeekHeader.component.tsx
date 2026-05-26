import type { CSSProperties } from 'react'
import { themeClass } from '@shared/styles/theme.styles'
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
    <div className={`sticky top-0 z-30 grid border-b bg-ui-surface-muted/90 backdrop-blur-md ${themeClass.border.grid}`} style={gridStyle}>
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
          className={`border-r p-1.5 text-center transition-colors md:p-3 ${themeClass.border.grid} ${isToday ? 'bg-ui-primary-soft' : ''} ${closed ? 'bg-ui-surface-muted' : ''}`}
        >
          <div className={`text-[9px] font-bold uppercase tracking-wider md:text-[10px] ${closed ? themeClass.text.subtle : themeClass.text.muted}`}>
            {SHORT_WEEKDAY_LABELS[day.getDay()]}
          </div>
          <div className={`text-base md:text-lg ${isToday ? `font-bold ${themeClass.text.primary}` : closed ? themeClass.text.subtle : themeClass.text.default}`}>
            {day.getDate()}
          </div>
        </div>
      ))}
    </div>
  )
}

export default CalendarWeekHeader
