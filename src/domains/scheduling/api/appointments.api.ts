import { apiClient } from '@shared/api'
import type { AppointmentStatus, CalendarItem } from '../model/scheduling.types'
import { getTimezoneDateRangeUtc } from '../utils/calendarTime.utils'
import type {
  AppointmentMutationResponseDto,
  AppointmentStatusResponseDto,
  DeleteAppointmentResponseDto,
  GetAppointmentsResponseDto,
} from './appointments.mapper'
import { mapAppointmentDtoToCalendarItem } from './appointments.mapper'

const APPOINTMENTS_ENDPOINT = '/v1/appointment'

interface AuthenticatedRequestParams {
  token: string
}

export interface GetWeeklyAppointmentsParams extends AuthenticatedRequestParams {
  centerId: string
  selectedDate: Date
  timezone: string
}

export interface CreateAppointmentParams extends AuthenticatedRequestParams {
  appointment: CalendarItem
  centerId: string
}

export interface UpdateAppointmentParams extends CreateAppointmentParams {
  appointmentId: string
}

export interface UpdateAppointmentStatusParams extends AuthenticatedRequestParams {
  appointmentId: string
  centerId: string
  status: AppointmentStatus
}

export interface DeleteAppointmentParams extends AuthenticatedRequestParams {
  appointmentId: string
  centerId: string
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function getWeeklyAppointments({ centerId, selectedDate, timezone, token }: GetWeeklyAppointmentsParams): Promise<CalendarItem[]> {
  const { from, to } = getTimezoneDateRangeUtc(selectedDate, timezone)
  const query = new URLSearchParams({ centerId, from, to })
  const response = await apiClient.get<GetAppointmentsResponseDto>(`${APPOINTMENTS_ENDPOINT}?${query.toString()}`, {
    headers: authHeaders(token),
  })

  return response.appointments.map(mapAppointmentDtoToCalendarItem)
}

export async function createAppointment({ appointment, centerId, token }: CreateAppointmentParams): Promise<CalendarItem> {
  const response = await apiClient.post<AppointmentMutationResponseDto>(APPOINTMENTS_ENDPOINT, {
    body: { ...appointment, centerId },
    headers: authHeaders(token),
  })

  return mapAppointmentDtoToCalendarItem(response.appointment)
}

export async function updateAppointment({ appointment, appointmentId, centerId, token }: UpdateAppointmentParams): Promise<CalendarItem> {
  const response = await apiClient.put<AppointmentMutationResponseDto>(APPOINTMENTS_ENDPOINT, {
    body: { ...appointment, appointmentId, centerId },
    headers: authHeaders(token),
  })

  return mapAppointmentDtoToCalendarItem(response.appointment)
}

export function updateAppointmentStatus({ appointmentId, centerId, status, token }: UpdateAppointmentStatusParams): Promise<AppointmentStatusResponseDto> {
  return apiClient.patch<AppointmentStatusResponseDto>(`${APPOINTMENTS_ENDPOINT}/status`, {
    body: { appointmentId, centerId, status },
    headers: authHeaders(token),
  })
}

export function deleteAppointment({ appointmentId, centerId, token }: DeleteAppointmentParams): Promise<DeleteAppointmentResponseDto> {
  return apiClient.delete<DeleteAppointmentResponseDto>(APPOINTMENTS_ENDPOINT, {
    body: { appointmentId, centerId },
    headers: authHeaders(token),
  })
}
