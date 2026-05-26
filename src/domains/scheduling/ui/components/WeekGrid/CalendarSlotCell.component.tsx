import type { HoverHighlight, HoverHighlightHandler, SlotKeyboardHandler, SlotPointerHandler } from '../../types/weekGrid.types'
import { getSlotHighlightClassName, WEEK_GRID_LINE_CLASS } from '../../styles/weekGrid.styles'

interface CalendarSlotCellProps {
  activeSlotHighlight: HoverHighlight | null
  day: Date
  dayKey: string
  hoverHighlight: HoverHighlight | null
  onKeyDown: SlotKeyboardHandler
  onMouseEnter: HoverHighlightHandler
  onMouseLeave: HoverHighlightHandler
  onOpen: SlotPointerHandler
  rowHeightPx: number
  slot: string
  slottingEnabled: boolean
}

function CalendarSlotCell({
  activeSlotHighlight,
  day,
  dayKey,
  hoverHighlight,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onOpen,
  rowHeightPx,
  slot,
  slottingEnabled,
}: Readonly<CalendarSlotCellProps>) {
  const cellActive = slottingEnabled && activeSlotHighlight?.dayKey === dayKey && activeSlotHighlight.slot === slot
  const cellHover = slottingEnabled && !cellActive && hoverHighlight?.dayKey === dayKey && hoverHighlight.slot === slot

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(event) => onOpen(event, day, slot)}
      onMouseEnter={() => slottingEnabled && onMouseEnter({ dayKey, slot })}
      onMouseLeave={() => slottingEnabled && onMouseLeave(null)}
      onKeyDown={(event) => onKeyDown(event, day, dayKey, slot)}
      className={`${WEEK_GRID_LINE_CLASS} box-border cursor-pointer transition-[background-color,border-radius,box-shadow] ${getSlotHighlightClassName(cellActive, cellHover, slottingEnabled ? 'hover:rounded-md hover:bg-ui-primary-soft hover:ring-1 hover:ring-inset hover:ring-primary-500/40' : '')}`}
      style={{ height: rowHeightPx, minHeight: rowHeightPx }}
      aria-label={`Horario ${slot}`}
    />
  )
}

export default CalendarSlotCell
