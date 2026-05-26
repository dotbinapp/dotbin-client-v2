import {
  DEFAULT_BASE_MINUTES,
  DEFAULT_CLOSE_TIME,
  DEFAULT_OPEN_TIME,
  WEEKDAY_NAMES,
} from '../model/calendar.constants'
import type {
  CalendarItem,
  AppointmentStatus,
  CenterSchedule,
  DoctorWorkHours,
  PositionedCalendarItem,
  WeekDay,
} from '../model/scheduling.types'
import { buildRangeSlots, formatDateKey, getDateFromIso, getDurationMinutes, getTimeFromIso, toMinutes, toTimeValue } from './calendarTime.utils'

export function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)

  return nextDate
}

export function getStartOfWeek(date: Date): Date {
  const nextDate = new Date(date)
  const day = nextDate.getDay()
  const diff = nextDate.getDate() - day + (day === 0 ? -6 : 1)

  return new Date(nextDate.setDate(diff))
}

export function getWeekDays(selectedDate: Date): Date[] {
  const startOfWeek = getStartOfWeek(selectedDate)

  return Array.from({ length: 7 }, (_, index) => addDays(startOfWeek, index))
}

export function getClosedDays(schedule?: CenterSchedule[] | null): Map<WeekDay, boolean> | null {
  if (!schedule) return null

  return new Map(schedule.map((entry) => [entry.day, Boolean(entry.closed)]))
}

export function getWeekSlots(schedule?: CenterSchedule[] | null, intervalMinutes = 30): { baseMinutes: number; slots: string[] } {
  const openDays = schedule?.filter((day) => !day.closed && day.open && day.close) ?? []

  if (openDays.length === 0) {
    return {
      baseMinutes: DEFAULT_BASE_MINUTES,
      slots: buildRangeSlots(DEFAULT_OPEN_TIME, DEFAULT_CLOSE_TIME, intervalMinutes),
    }
  }

  const earliestOpen = Math.min(...openDays.map((day) => toMinutes(day.open)))
  const latestClose = Math.max(...openDays.map((day) => toMinutes(day.close)))

  return {
    baseMinutes: earliestOpen,
    slots: buildRangeSlots(toTimeValue(earliestOpen), toTimeValue(latestClose), intervalMinutes),
  }
}

export function groupCalendarItemsByDate(items: CalendarItem[], timezone: string): Map<string, CalendarItem[]> {
  const groupedItems = new Map<string, CalendarItem[]>()

  for (const item of items) {
    const dateKey = getDateFromIso(item.start, timezone)
    const itemsForDate = groupedItems.get(dateKey) ?? []
    groupedItems.set(dateKey, [...itemsForDate, item])
  }

  return groupedItems
}

export function getQuickStatusFilter(item: CalendarItem): AppointmentStatus {
  if (item.type === 'BLOCK') return 'BLOCKED'
  if (item.status === 'DEPOSIT_PENDING' || item.status === 'DEPOSIT_RECEIVED') return 'PENDING'

  return item.status
}

export function isSlotWithinDoctorWorkHours(
  workHours: DoctorWorkHours,
  day: Date,
  slot: string,
  slotIntervalMinutes: number,
): boolean {
  const ranges = workHours[WEEKDAY_NAMES[day.getDay()]] ?? []
  const slotStart = toMinutes(slot)
  const slotEnd = slotStart + slotIntervalMinutes

  return ranges.some((range) => {
    const rangeStart = toMinutes(range.start)
    const rangeEnd = toMinutes(range.end)

    return slotStart >= rangeStart && slotEnd <= rangeEnd
  })
}

export function getPositionedCalendarItems(
  calendarItems: CalendarItem[],
  pxPerMinute: number,
  baseMinutes = DEFAULT_BASE_MINUTES,
  timezone: string,
): PositionedCalendarItem[] {
  const sortedItems = [...calendarItems].sort((left, right) => (
    toMinutes(getTimeFromIso(left.start, timezone)) - toMinutes(getTimeFromIso(right.start, timezone))
  ))

  const positionedItems: PositionedCalendarItem[] = []
  const laneEnds: number[][] = []

  for (const item of sortedItems) {
    const start = toMinutes(getTimeFromIso(item.start, timezone))
    const end = item.end ? toMinutes(getTimeFromIso(item.end, timezone)) : start + item.durationMinutes
    let laneIndex = laneEnds.findIndex((lane) => lane[lane.length - 1] <= start)

    if (laneIndex === -1) {
      laneEnds.push([end])
      laneIndex = laneEnds.length - 1
    } else {
      laneEnds[laneIndex].push(end)
    }

    positionedItems.push({
      height: Math.max(getDurationMinutes(item.start, item.end, timezone) || item.durationMinutes, 5) * pxPerMinute - 2,
      item,
      left: laneIndex,
      top: (start - baseMinutes) * pxPerMinute,
      width: 0,
    })
  }

  applyClusterWidths(positionedItems, timezone)

  return positionedItems
}

function applyClusterWidths(positionedItems: PositionedCalendarItem[], timezone: string): void {
  let currentCluster: PositionedCalendarItem[] = []
  let clusterMaxEnd = 0

  for (const positionedItem of positionedItems) {
    const start = toMinutes(getTimeFromIso(positionedItem.item.start, timezone))
    const end = positionedItem.item.end
      ? toMinutes(getTimeFromIso(positionedItem.item.end, timezone))
      : start + positionedItem.item.durationMinutes

    if (currentCluster.length > 0 && start >= clusterMaxEnd) {
      finalizeCluster(currentCluster)
      currentCluster = []
      clusterMaxEnd = 0
    }

    currentCluster.push(positionedItem)
    clusterMaxEnd = Math.max(clusterMaxEnd, end)
  }

  finalizeCluster(currentCluster)
}

function finalizeCluster(cluster: PositionedCalendarItem[]): void {
  if (cluster.length === 0) return

  const columnsInCluster = Math.max(...cluster.map((item) => item.left)) + 1

  for (const item of cluster) {
    item.width = 100 / columnsInCluster
    item.left *= item.width
  }
}

export function isClosedDay(day: Date, closedDays: Map<WeekDay, boolean> | null): boolean {
  if (!closedDays) return false

  return closedDays.get(WEEKDAY_NAMES[day.getDay()]) !== false
}

export function isToday(day: Date): boolean {
  return formatDateKey(day) === formatDateKey(new Date())
}
