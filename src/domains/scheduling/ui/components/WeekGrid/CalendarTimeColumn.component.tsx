import { themeClass } from '@shared/styles/theme.styles'
import type { HoverHighlight } from '../../types/weekGrid.types'
import { getSlotHighlightClassName, WEEK_GRID_LINE_CLASS } from '../../styles/weekGrid.styles'

interface CalendarTimeColumnProps {
  activeSlotHighlight: HoverHighlight | null
  hoverHighlight: HoverHighlight | null
  rowHeightPx: number
  slots: string[]
  slottingEnabled: boolean
}

function CalendarTimeColumn({ activeSlotHighlight, hoverHighlight, rowHeightPx, slots, slottingEnabled }: Readonly<CalendarTimeColumnProps>) {
  return (
    <div className={`z-10 border-r bg-ui-surface-muted ${themeClass.border.grid}`}>
      {slots.map((slot) => {
        const rowActive = slottingEnabled && activeSlotHighlight?.slot === slot
        const rowHover = slottingEnabled && !rowActive && hoverHighlight?.slot === slot

        return (
          <div
            key={slot}
            className={`relative flex items-start justify-center pt-0.5 text-center text-[10px] transition-[background-color,border-radius,box-shadow,color,font-weight] ${WEEK_GRID_LINE_CLASS} ${getSlotHighlightClassName(rowActive, rowHover, themeClass.text.subtle)}`}
            style={{ height: rowHeightPx, minHeight: rowHeightPx }}
          >
            <span className="leading-tight tabular-nums">{slot}</span>
          </div>
        )
      })}
    </div>
  )
}

export default CalendarTimeColumn
