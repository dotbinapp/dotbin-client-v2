export const schedulingAppointmentQueryKeys = {
  all: ['scheduling', 'appointments'] as const,
  weekly: (centerId: string, weekDate: string, timezone: string) => (
    [...schedulingAppointmentQueryKeys.all, 'weekly', centerId, weekDate, timezone] as const
  ),
}
