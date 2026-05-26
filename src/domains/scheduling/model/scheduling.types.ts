export type WeekDay = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'BLOCKED'
  | 'DEPOSIT_PENDING'
  | 'DEPOSIT_RECEIVED'

export type CalendarSlotIntent = 'appointment' | 'block'

export type CalendarSlotIntervalMinutes = 5 | 10 | 15 | 20 | 25 | 30

export interface CenterSchedule {
  close: string
  closed?: boolean
  day: WeekDay
  open: string
}

export interface WorkHourRange {
  end: string
  start: string
}

export type DoctorWorkHours = Record<WeekDay, WorkHourRange[]>

interface TimeSlot {
  date?: string
  durationMinutes: number
  end?: string
  id: string
  notes?: string
  start: string
  timezone?: string
}

export interface CalendarAppointment extends TimeSlot {
  depositAmount?: number
  doctorId: string
  isSpecial?: boolean
  itsPaid?: boolean
  patientFullName?: string
  patientId?: string | null
  status: AppointmentStatus
  totalAmount: number
  treatmentIds?: string[]
  treatmentNames?: string[]
  type: 'APPOINTMENT'
}

export interface CalendarBlock extends TimeSlot {
  blockReason?: string
  doctorId?: string
  status?: 'CONFIRMED'
  type: 'BLOCK'
}

export type CalendarItem = CalendarAppointment | CalendarBlock

export interface PositionedCalendarItem {
  height: number
  item: CalendarItem
  left: number
  top: number
  width: number
}

export interface CalendarWeekColumn {
  closed: boolean
  day: Date
  dayKey: string
  isToday: boolean
  positionedItems: PositionedCalendarItem[]
}
