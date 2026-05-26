import CalendarItemCard from '../CalendarItemCard.component'
import CalendarSlotCell from './CalendarSlotCell.component'
import type { HoverHighlight, HoverHighlightHandler, SlotKeyboardHandler, SlotPointerHandler } from '../../types/weekGrid.types'
import { WEEK_GRID_LINE_CLASS } from '../../styles/weekGrid.styles'
import { CREATE_SLOT_GUTTER_PX } from '../../../model/calendar.constants'
import type { CalendarItem, PositionedCalendarItem } from '../../../model/scheduling.types'

interface CalendarDayColumnProps {
  activeSlotHighlight: HoverHighlight | null
  closed: boolean
  day: Date
  dayKey: string
  gridMinHeight: number
  hoverHighlight: HoverHighlight | null
  onItemOpen?: (item: CalendarItem) => void
  onSlotKeyDown: SlotKeyboardHandler
  onSlotMouseEnter: HoverHighlightHandler
  onSlotMouseLeave: HoverHighlightHandler
  onSlotOpen: SlotPointerHandler
  positionedItems: PositionedCalendarItem[]
  rowHeightPx: number
  slots: string[]
  slottingEnabled: boolean
  timezone: string
}

function CalendarDayColumn({
  activeSlotHighlight,
  closed,
  day,
  dayKey,
  gridMinHeight,
  hoverHighlight,
  onItemOpen,
  onSlotKeyDown,
  onSlotMouseEnter,
  onSlotMouseLeave,
  onSlotOpen,
  positionedItems,
  rowHeightPx,
  slots,
  slottingEnabled,
  timezone,
}: Readonly<CalendarDayColumnProps>) {
  return (
    <div className={`relative overflow-visible border-r border-slate-300/60 ${closed ? 'bg-slate-100' : 'bg-white'}`}>
      {slots.map((slot) => (closed
        ? <div key={`${dayKey}-${slot}`} className={`${WEEK_GRID_LINE_CLASS} box-border bg-slate-200/40`} style={{ height: rowHeightPx, minHeight: rowHeightPx }} />
        : (
          <CalendarSlotCell
            key={`${dayKey}-${slot}`}
            activeSlotHighlight={activeSlotHighlight}
            day={day}
            dayKey={dayKey}
            hoverHighlight={hoverHighlight}
            rowHeightPx={rowHeightPx}
            slot={slot}
            slottingEnabled={slottingEnabled}
            onKeyDown={onSlotKeyDown}
            onMouseEnter={onSlotMouseEnter}
            onMouseLeave={onSlotMouseLeave}
            onOpen={onSlotOpen}
          />
        )
      ))}

      {!closed ? (
        <div
          className="pointer-events-none absolute bottom-0 left-0 top-0 overflow-visible"
          style={{ minHeight: gridMinHeight, right: CREATE_SLOT_GUTTER_PX }}
        >
          {positionedItems.map((positionedItem) => (
            <CalendarItemCard
              key={positionedItem.item.id}
              positionedItem={positionedItem}
              timezone={timezone}
              onOpen={() => onItemOpen?.(positionedItem.item)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default CalendarDayColumn
