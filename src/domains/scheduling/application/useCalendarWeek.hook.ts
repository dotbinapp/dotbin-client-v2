import { useCallback, useMemo, useState } from 'react'
import {
  CLOSED_DAY_WIDTH_PX,
  CALENDAR_QUICK_STATUS_FILTERS,
  OPEN_DAY_MIN_WIDTH_PX,
  ROW_HEIGHT_PX,
  TIME_COLUMN_WIDTH_PX,
} from '../model/calendar.constants'
import type {
  AppointmentStatus,
  CalendarItem,
  CalendarSlotIntervalMinutes,
  CalendarWeekColumn,
  CenterSchedule,
} from '../model/scheduling.types'
import {
  getClosedDays,
  getPositionedCalendarItems,
  getQuickStatusFilter,
  getWeekDays,
  getWeekSlots,
  groupCalendarItemsByDate,
  isClosedDay,
  isToday,
} from '../utils/calendarWeek.utils'
import { formatDateKey } from '../utils/calendarTime.utils'

interface UseCalendarWeekParams {
  items: CalendarItem[]
  schedule?: CenterSchedule[] | null
  selectedDate: Date
  timezone: string
}

export function useCalendarWeek({ items, schedule, selectedDate, timezone }: UseCalendarWeekParams) {
  const [slotIntervalMinutes, setSlotIntervalMinutes] = useState<CalendarSlotIntervalMinutes>(30)
  const [selectedStatusFilters, setSelectedStatusFilters] = useState<AppointmentStatus[]>([])

  const { baseMinutes, slots } = useMemo(
    () => getWeekSlots(schedule, slotIntervalMinutes),
    [schedule, slotIntervalMinutes],
  )
  const rowHeightPx = ROW_HEIGHT_PX
  const pxPerMinute = rowHeightPx / slotIntervalMinutes

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])
  const closedDays = useMemo(() => getClosedDays(schedule), [schedule])

  const statusFilterCounts = useMemo(() => {
    const counts = new Map<AppointmentStatus, number>(CALENDAR_QUICK_STATUS_FILTERS.map((status) => [status, 0]))

    for (const item of items) {
      const status = getQuickStatusFilter(item)
      counts.set(status, (counts.get(status) ?? 0) + 1)
    }

    return counts
  }, [items])

  const filteredItems = useMemo(() => {
    if (selectedStatusFilters.length === 0) return items

    const selected = new Set(selectedStatusFilters)
    return items.filter((item) => selected.has(getQuickStatusFilter(item)))
  }, [items, selectedStatusFilters])

  const itemsByDate = useMemo(
    () => groupCalendarItemsByDate(filteredItems, timezone),
    [filteredItems, timezone],
  )

  const weekColumns = useMemo<CalendarWeekColumn[]>(() => weekDays.map((day) => {
    const dayKey = formatDateKey(day)
    const dayItems = itemsByDate.get(dayKey) ?? []

    return {
      closed: isClosedDay(day, closedDays),
      day,
      dayKey,
      isToday: isToday(day),
      positionedItems: getPositionedCalendarItems(dayItems, pxPerMinute, baseMinutes, timezone),
    }
  }), [baseMinutes, closedDays, itemsByDate, pxPerMinute, timezone, weekDays])

  const gridStyle = useMemo(() => {
    const dayColumns = weekColumns
      .map(({ closed }) => (closed ? `${CLOSED_DAY_WIDTH_PX}px` : `minmax(${OPEN_DAY_MIN_WIDTH_PX}px, 1fr)`))
      .join(' ')
    const minWidth = weekColumns.reduce(
      (total, { closed }) => total + (closed ? CLOSED_DAY_WIDTH_PX : OPEN_DAY_MIN_WIDTH_PX),
      TIME_COLUMN_WIDTH_PX,
    )

    return {
      gridTemplateColumns: `${TIME_COLUMN_WIDTH_PX}px ${dayColumns}`,
      minWidth,
    }
  }, [weekColumns])

  const toggleStatusFilter = useCallback((status: AppointmentStatus) => {
    setSelectedStatusFilters((current) => (
      current.includes(status)
        ? current.filter((item) => item !== status)
        : [...current, status]
    ))
  }, [])

  const clearStatusFilters = useCallback(() => setSelectedStatusFilters([]), [])

  return {
    baseMinutes,
    clearStatusFilters,
    gridMinHeight: slots.length * rowHeightPx,
    gridStyle,
    pxPerMinute,
    rowHeightPx,
    selectedStatusFilters,
    setSlotIntervalMinutes,
    slotIntervalMinutes,
    slots,
    statusFilterCounts,
    toggleStatusFilter,
    weekColumns,
  }
}
