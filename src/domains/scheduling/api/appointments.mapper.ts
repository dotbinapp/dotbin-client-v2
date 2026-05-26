import type { AppointmentStatus, CalendarAppointment, CalendarBlock, CalendarItem } from '../model/scheduling.types'

interface PersonNameDto {
  firstName?: string | null
  lastName?: string | null
  name?: string | null
}

interface TreatmentDto {
  id?: string | null
  name?: string | null
}

interface BackendAppointmentDto {
  blockReason?: string | null
  date?: string | null
  depositAmount?: number | null
  doctorId?: string | null
  durationMinutes?: number | null
  end?: string | null
  id: string
  isSpecial?: boolean | null
  itsPaid?: boolean | null
  notes?: string | null
  patient?: PersonNameDto | null
  patientId?: string | null
  prospectData?: PersonNameDto | null
  start: string
  status?: AppointmentStatus | null
  timezone?: string | null
  totalAmount?: number | null
  treatmentIds?: string[] | null
  treatments?: TreatmentDto[] | null
  type: 'APPOINTMENT' | 'BLOCK'
}

export interface GetAppointmentsResponseDto {
  appointments: BackendAppointmentDto[]
  ok: boolean
}

export interface AppointmentMutationResponseDto {
  appointment: BackendAppointmentDto
  ok: boolean
}

export interface AppointmentStatusResponseDto {
  consultationId?: string
  ok: boolean
}

export interface DeleteAppointmentResponseDto {
  ok: boolean
}

export function mapAppointmentDtoToCalendarItem(appointment: BackendAppointmentDto): CalendarItem {
  if (appointment.type === 'BLOCK') {
    return mapBlockDto(appointment)
  }

  return mapCalendarAppointmentDto(appointment)
}

function mapCalendarAppointmentDto(appointment: BackendAppointmentDto): CalendarAppointment {
  return {
    date: appointment.date ?? undefined,
    depositAmount: appointment.depositAmount ?? undefined,
    doctorId: appointment.doctorId ?? '',
    durationMinutes: appointment.durationMinutes ?? 0,
    end: appointment.end ?? undefined,
    id: appointment.id,
    isSpecial: appointment.isSpecial ?? undefined,
    itsPaid: appointment.itsPaid ?? undefined,
    notes: appointment.notes ?? undefined,
    patientFullName: getPatientFullName(appointment),
    patientId: appointment.patientId ?? null,
    start: appointment.start,
    status: appointment.status ?? 'PENDING',
    timezone: appointment.timezone ?? undefined,
    totalAmount: appointment.totalAmount ?? 0,
    treatmentIds: appointment.treatmentIds ?? undefined,
    treatmentNames: appointment.treatments?.map((treatment) => treatment.name).filter(isPresent) ?? undefined,
    type: 'APPOINTMENT',
  }
}

function mapBlockDto(appointment: BackendAppointmentDto): CalendarBlock {
  return {
    blockReason: appointment.blockReason ?? undefined,
    date: appointment.date ?? undefined,
    doctorId: appointment.doctorId ?? undefined,
    durationMinutes: appointment.durationMinutes ?? 0,
    end: appointment.end ?? undefined,
    id: appointment.id,
    notes: appointment.notes ?? undefined,
    start: appointment.start,
    status: 'CONFIRMED',
    timezone: appointment.timezone ?? undefined,
    type: 'BLOCK',
  }
}

function getPatientFullName(appointment: BackendAppointmentDto): string | undefined {
  const person = appointment.patient ?? appointment.prospectData
  if (!person) return undefined
  if (person.name) return person.name

  return [person.firstName, person.lastName].filter(isPresent).join(' ') || undefined
}

function isPresent(value: string | null | undefined): value is string {
  return Boolean(value)
}
