import { useQuery } from '@tanstack/react-query'
import { getWeeklyAppointments } from '../api/appointments.api'
import { formatDateKey } from '../utils/calendarTime.utils'
import { schedulingAppointmentQueryKeys } from './appointments.queryKeys'

interface UseWeeklyAppointmentsQueryParams {
  centerId?: string
  getAccessToken: () => Promise<string>
  selectedDate: Date
  timezone: string
}

export function useWeeklyAppointmentsQuery({ centerId, getAccessToken, selectedDate, timezone }: UseWeeklyAppointmentsQueryParams) {
  return useQuery({
    enabled: Boolean(centerId),
    queryFn: async () => {
      if (!centerId) return []

      const token = await getAccessToken()
      return getWeeklyAppointments({ centerId, selectedDate, timezone, token })
    },
    queryKey: schedulingAppointmentQueryKeys.weekly(centerId ?? 'no-center', formatDateKey(selectedDate), timezone),
  })
}
