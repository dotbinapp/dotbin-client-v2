import { DEFAULT_CALENDAR_TIMEZONE } from '../model/calendar.constants'

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

export function isValidTime(value: string | null | undefined): value is string {
  return Boolean(value && TIME_PATTERN.test(value))
}

export function toMinutes(time: string): number {
  if (!isValidTime(time)) return 0

  const [hours, minutes] = time.split(':').map(Number)
  return (hours * 60) + minutes
}

export function toTimeValue(minutes: number): string {
  const hours = Math.floor(minutes / 60).toString().padStart(2, '0')
  const mins = (minutes % 60).toString().padStart(2, '0')

  return `${hours}:${mins}`
}

export function buildRangeSlots(open: string, close: string, intervalMinutes: number): string[] {
  const startMinutes = toMinutes(open)
  const endMinutes = toMinutes(close)

  if (endMinutes <= startMinutes || intervalMinutes < 1) return []

  const slots: string[] = []
  for (let minutes = startMinutes; minutes <= endMinutes; minutes += intervalMinutes) {
    slots.push(toTimeValue(minutes))
  }

  return slots
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getTimeFromIso(isoDate: string, timezone = DEFAULT_CALENDAR_TIMEZONE): string {
  if (!isoDate) return ''

  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    timeZone: timezone,
  }).format(new Date(isoDate))
}

export function getDateFromIso(isoDate: string, timezone = DEFAULT_CALENDAR_TIMEZONE): string {
  if (!isoDate) return ''

  const parts = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: timezone,
    year: 'numeric',
  }).formatToParts(new Date(isoDate))

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

export function getDurationMinutes(start: string, end: string | undefined, timezone = DEFAULT_CALENDAR_TIMEZONE): number {
  if (!end) return 0

  return toMinutes(getTimeFromIso(end, timezone)) - toMinutes(getTimeFromIso(start, timezone))
}
