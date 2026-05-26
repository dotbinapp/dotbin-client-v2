import type { CalendarSlotIntervalMinutes, WeekDay } from './scheduling.types'
import type { AppointmentStatus } from './scheduling.types'

export const CALENDAR_SLOT_INTERVALS: CalendarSlotIntervalMinutes[] = [5, 10, 15, 20, 25, 30]

export const DEFAULT_CALENDAR_TIMEZONE = 'America/Buenos_Aires'
export const DEFAULT_SLOT_INTERVAL_MINUTES: CalendarSlotIntervalMinutes = 30
export const DEFAULT_BASE_MINUTES = 420
export const DEFAULT_OPEN_TIME = '07:00'
export const DEFAULT_CLOSE_TIME = '21:00'

export const WEEKDAY_NAMES: WeekDay[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
export const SHORT_WEEKDAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
export const FULL_WEEKDAY_LABELS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export const TIME_COLUMN_WIDTH_PX = 60
export const OPEN_DAY_MIN_WIDTH_PX = 100
export const CLOSED_DAY_WIDTH_PX = 44
export const CREATE_SLOT_GUTTER_PX = 18
export const PX_PER_MINUTE = 120 / 30
export const ROW_REFERENCE_INTERVAL_MINUTES = 15
export const ROW_HEIGHT_PX = PX_PER_MINUTE * ROW_REFERENCE_INTERVAL_MINUTES

export const CALENDAR_QUICK_STATUS_FILTERS: AppointmentStatus[] = [
  'CONFIRMED',
  'PENDING',
  'COMPLETED',
  'CANCELLED',
  'BLOCKED',
]
