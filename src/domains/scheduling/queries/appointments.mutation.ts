import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createAppointment,
  deleteAppointment,
  updateAppointment,
  updateAppointmentStatus,
} from '../api/appointments.api'
import { schedulingAppointmentQueryKeys } from './appointments.queryKeys'

export function useInvalidateWeeklyAppointments() {
  const queryClient = useQueryClient()

  return () => queryClient.invalidateQueries({ queryKey: schedulingAppointmentQueryKeys.all })
}

export function useCreateAppointmentMutation() {
  const invalidateWeeklyAppointments = useInvalidateWeeklyAppointments()

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: invalidateWeeklyAppointments,
  })
}

export function useUpdateAppointmentMutation() {
  const invalidateWeeklyAppointments = useInvalidateWeeklyAppointments()

  return useMutation({
    mutationFn: updateAppointment,
    onSuccess: invalidateWeeklyAppointments,
  })
}

export function useUpdateAppointmentStatusMutation() {
  const invalidateWeeklyAppointments = useInvalidateWeeklyAppointments()

  return useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: invalidateWeeklyAppointments,
  })
}

export function useDeleteAppointmentMutation() {
  const invalidateWeeklyAppointments = useInvalidateWeeklyAppointments()

  return useMutation({
    mutationFn: deleteAppointment,
    onSuccess: invalidateWeeklyAppointments,
  })
}
