import { useMemo } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import type { CalendarItem } from '../model/scheduling.types'
import { useWeeklyAppointmentsQuery } from '../queries/appointments.query'

interface UseWeeklyCalendarDataParams {
  centerId?: string
  selectedDate: Date
  selectedDoctorIds: string[]
  timezone: string
}

export function useWeeklyCalendarData({ centerId, selectedDate, selectedDoctorIds, timezone }: UseWeeklyCalendarDataParams) {
  const { getAccessTokenSilently } = useAuth0()
  const weeklyAppointments = useWeeklyAppointmentsQuery({
    centerId,
    getAccessToken: getAccessTokenSilently,
    selectedDate,
    timezone,
  })

  const visibleItems = useMemo(
    () => filterVisibleCalendarItems(weeklyAppointments.data ?? [], selectedDoctorIds),
    [selectedDoctorIds, weeklyAppointments.data],
  )

  return {
    error: weeklyAppointments.error,
    isError: weeklyAppointments.isError,
    isLoading: weeklyAppointments.isLoading,
    items: visibleItems,
  }
}

function filterVisibleCalendarItems(items: CalendarItem[], selectedDoctorIds: string[]): CalendarItem[] {
  if (selectedDoctorIds.length === 0) return []

  const selectedDoctors = new Set(selectedDoctorIds)

  return items.filter((item) => {
    if (item.type === 'APPOINTMENT') {
      return item.status !== 'CANCELLED' && selectedDoctors.has(item.doctorId)
    }

    if (!item.doctorId) return true

    return selectedDoctors.has(item.doctorId)
  })
}
