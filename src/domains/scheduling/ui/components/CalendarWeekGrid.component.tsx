import { useCallback, useEffect, useMemo, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { themeClass } from '@shared/styles/theme.styles'
import CalendarSlotIntentMenu from './CalendarSlotIntentMenu.component'
import CalendarStatusFilters from './CalendarStatusFilters.component'
import CalendarDayColumn from './WeekGrid/CalendarDayColumn.component'
import CalendarTimeColumn from './WeekGrid/CalendarTimeColumn.component'
import CalendarWeekHeader from './WeekGrid/CalendarWeekHeader.component'
import type { HoverHighlight, SlotMenuState } from '../types/weekGrid.types'
import { useCalendarWeek } from '../../application/useCalendarWeek.hook'
import type {
  CalendarItem,
  CalendarSlotIntent,
  CenterSchedule,
} from '../../model/scheduling.types'
import { formatDateKey } from '../../utils/calendarTime.utils'
import { getSlotMenuPosition } from '../../utils/weekGrid.utils'

interface CalendarWeekGridProps {
  canEdit?: boolean
  items: CalendarItem[]
  loading?: boolean
  onItemOpen?: (item: CalendarItem) => void
  onSlotIntent?: (day: Date, startTime: string, intent: CalendarSlotIntent) => void
  schedule?: CenterSchedule[] | null
  selectedDate: Date
  timezone: string
}

function CalendarWeekGrid({
  canEdit = true,
  items,
  loading = false,
  onItemOpen,
  onSlotIntent,
  schedule,
  selectedDate,
  timezone,
}: Readonly<CalendarWeekGridProps>) {
  const [slotMenu, setSlotMenu] = useState<SlotMenuState | null>(null)
  const [hoverHighlight, setHoverHighlight] = useState<HoverHighlight | null>(null)
  const [intervalMenuRect, setIntervalMenuRect] = useState<DOMRect | null>(null)
  const slottingEnabled = Boolean(canEdit && onSlotIntent)
  const activeSlotHighlight = slotMenu ? { dayKey: slotMenu.dayKey, slot: slotMenu.slot } : null
  const menuPosition = useMemo(() => getSlotMenuPosition(slotMenu?.clientX ?? 0, slotMenu?.clientY ?? 0), [slotMenu])

  const calendarWeek = useCalendarWeek({ items, schedule, selectedDate, timezone })

  useEffect(() => {
    if (!slotMenu) return undefined

    const closeMenu = (event: globalThis.MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('[data-week-slot-menu]')) return
      setSlotMenu(null)
    }

    const id = window.setTimeout(() => window.addEventListener('click', closeMenu), 0)

    return () => {
      window.clearTimeout(id)
      window.removeEventListener('click', closeMenu)
    }
  }, [slotMenu])

  useEffect(() => {
    if (!intervalMenuRect) return undefined

    const closeMenu = (event: globalThis.MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('[data-week-interval-menu]') || target.closest('[data-week-interval-trigger]')) return
      setIntervalMenuRect(null)
    }

    const id = window.setTimeout(() => window.addEventListener('click', closeMenu), 0)

    return () => {
      window.clearTimeout(id)
      window.removeEventListener('click', closeMenu)
    }
  }, [intervalMenuRect])

  const openSlotMenu = useCallback((event: MouseEvent, day: Date, slot: string) => {
    event.stopPropagation()
    event.preventDefault()
    if (!slottingEnabled) return

    setIntervalMenuRect(null)
    setSlotMenu({ clientX: event.clientX, clientY: event.clientY, day, dayKey: formatDateKey(day), slot })
  }, [slottingEnabled])

  const toggleIntervalMenu = useCallback((rect: DOMRect) => {
    setSlotMenu(null)
    setIntervalMenuRect((currentRect) => (currentRect ? null : rect))
  }, [])

  const openSlotMenuWithKeyboard = useCallback((event: KeyboardEvent<HTMLDivElement>, day: Date, dayKey: string, slot: string) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    if (!slottingEnabled) return

    const rect = event.currentTarget.getBoundingClientRect()
    setSlotMenu({
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
      day,
      dayKey,
      slot,
    })
  }, [slottingEnabled])

  return (
    <div className={`relative flex h-full flex-col overflow-hidden ${themeClass.surface.muted}`}>
      <CalendarStatusFilters
        counts={calendarWeek.statusFilterCounts}
        onClear={calendarWeek.clearStatusFilters}
        onToggle={calendarWeek.toggleStatusFilter}
        selected={calendarWeek.selectedStatusFilters}
      />

      <div className="min-h-0 flex-1 overflow-auto custom-scrollbar">
        <CalendarWeekHeader
          disabled={loading}
          gridStyle={calendarWeek.gridStyle}
          intervalMenuRect={intervalMenuRect}
          intervalMinutes={calendarWeek.slotIntervalMinutes}
          weekColumns={calendarWeek.weekColumns}
          onIntervalChange={calendarWeek.setSlotIntervalMinutes}
          onIntervalClose={() => setIntervalMenuRect(null)}
          onIntervalToggle={toggleIntervalMenu}
        />

        <div className="relative grid flex-1" style={{ ...calendarWeek.gridStyle, minHeight: calendarWeek.gridMinHeight }}>
          <CalendarTimeColumn
            activeSlotHighlight={activeSlotHighlight}
            hoverHighlight={hoverHighlight}
            rowHeightPx={calendarWeek.rowHeightPx}
            slots={calendarWeek.slots}
            slottingEnabled={slottingEnabled}
          />

          {calendarWeek.weekColumns.map(({ closed, day, dayKey, positionedItems }) => (
            <CalendarDayColumn
              key={dayKey}
              activeSlotHighlight={activeSlotHighlight}
              closed={closed}
              day={day}
              dayKey={dayKey}
              gridMinHeight={calendarWeek.gridMinHeight}
              hoverHighlight={hoverHighlight}
              positionedItems={positionedItems}
              rowHeightPx={calendarWeek.rowHeightPx}
              slots={calendarWeek.slots}
              slottingEnabled={slottingEnabled}
              timezone={timezone}
              onItemOpen={onItemOpen}
              onSlotKeyDown={openSlotMenuWithKeyboard}
              onSlotMouseEnter={setHoverHighlight}
              onSlotMouseLeave={setHoverHighlight}
              onSlotOpen={openSlotMenu}
            />
          ))}
        </div>
      </div>

      <CalendarSlotIntentMenu
        isOpen={Boolean(slotMenu)}
        left={menuPosition.left}
        top={menuPosition.top}
        onSelect={(intent) => {
          if (!slotMenu) return
          onSlotIntent?.(slotMenu.day, slotMenu.slot, intent)
          setSlotMenu(null)
        }}
      />
    </div>
  )
}

export default CalendarWeekGrid
