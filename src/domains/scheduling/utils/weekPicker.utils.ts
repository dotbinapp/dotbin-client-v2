const ISO_DATE_SEPARATOR = '-'
const DAYS_IN_WEEK = 7
const MONTHS_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

export const WEEK_DAY_INITIALS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const
export const SCHEDULING_MONTHS = MONTHS_ES.map((label, value) => ({ label, value }))

export interface SchedulingWeekDay {
  date: Date
  dayLabel: string
  isoValue: string
  monthLabel: string
  numericDay: number
}

export interface SchedulingWeekRange {
  endDate: Date
  endDay: number
  endMonthLabel: string
  label: string
  startDate: Date
  startDay: number
  startMonthLabel: string
  value: string
}

export function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split(ISO_DATE_SEPARATOR).map(Number)

  if (!year || !month || !day) {
    return new Date()
  }

  return new Date(year, month - 1, day)
}

export function toIsoDateValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return [year, month, day].join(ISO_DATE_SEPARATOR)
}

export function getSchedulingWeek(value: string): SchedulingWeekDay[] {
  const selectedDate = parseIsoDate(value)
  const weekStart = getWeekStart(selectedDate)

  return Array.from({ length: DAYS_IN_WEEK }, (_, index) => {
    const date = addDays(weekStart, index)

    return {
      date,
      dayLabel: formatDayLabel(date),
      isoValue: toIsoDateValue(date),
      monthLabel: formatMonthLabel(date),
      numericDay: date.getDate(),
    }
  })
}

export function getSchedulingMonthWeeks(year: number, month: number): SchedulingWeekRange[] {
  const firstMonthDay = new Date(year, month, 1)
  const lastMonthDay = new Date(year, month + 1, 0)
  const firstWeekStart = getWeekStart(firstMonthDay)
  const monthWeeks: SchedulingWeekRange[] = []

  let weekStart = firstWeekStart

  while (weekStart <= lastMonthDay) {
    const weekEnd = addDays(weekStart, DAYS_IN_WEEK - 1)

    monthWeeks.push(createWeekRange(weekStart, weekEnd))
    weekStart = addDays(weekStart, DAYS_IN_WEEK)
  }

  return monthWeeks
}

export function getPreviousSchedulingWeek(value: string): string {
  return toIsoDateValue(addDays(getWeekStart(parseIsoDate(value)), -DAYS_IN_WEEK))
}

export function getNextSchedulingWeek(value: string): string {
  return toIsoDateValue(addDays(getWeekStart(parseIsoDate(value)), DAYS_IN_WEEK))
}

export function getSchedulingWeekLabel(value: string): string {
  const startDate = getWeekStart(parseIsoDate(value))
  const endDate = addDays(startDate, DAYS_IN_WEEK - 1)

  return createWeekRange(startDate, endDate).label
}

export function getSchedulingWeekStartValue(value: string): string {
  return toIsoDateValue(getWeekStart(parseIsoDate(value)))
}

export function getSchedulingYearOptions(selectedYear: number): number[] {
  const currentYear = new Date().getFullYear()
  const firstYear = Math.min(currentYear - 2, selectedYear - 2)
  const lastYear = Math.max(currentYear + 3, selectedYear + 2)

  return Array.from({ length: lastYear - firstYear + 1 }, (_, index) => firstYear + index)
}

export function getPreviousSchedulingMonth(year: number, month: number): Date {
  return new Date(year, month - 1, 1)
}

export function getNextSchedulingMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 1)
}

function createWeekRange(startDate: Date, endDate: Date): SchedulingWeekRange {
  const startMonthLabel = formatMonthLabel(startDate)
  const endMonthLabel = formatMonthLabel(endDate)
  const sameMonth = startMonthLabel === endMonthLabel
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()
  const label = sameMonth
    ? `${startDay} - ${endDay} ${endMonthLabel} ${endDate.getFullYear()}`
    : `${startDay} ${startMonthLabel} - ${endDay} ${endMonthLabel} ${endDate.getFullYear()}`

  return {
    endDate,
    endDay,
    endMonthLabel,
    label,
    startDate,
    startDay,
    startMonthLabel,
    value: toIsoDateValue(startDate),
  }
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date)
  nextDate.setDate(date.getDate() + days)

  return nextDate
}

function getWeekStart(date: Date): Date {
  const dayOffset = (date.getDay() + 6) % DAYS_IN_WEEK
  const monday = addDays(date, -dayOffset)

  monday.setHours(0, 0, 0, 0)

  return monday
}

function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(date).replace('.', '')
}

function formatMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', { month: 'short' }).format(date).replace('.', '')
}
