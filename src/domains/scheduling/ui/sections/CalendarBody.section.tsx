import { useMemo } from 'react'
import { useAppSelector } from '@app/store/hooks'
import { APP_PERMISSION_CODES, selectSessionCenter, selectSessionDoctor, usePermissions } from '@domains/identity-access'
import { themeClass } from '@shared/styles/theme.styles'
import { DEFAULT_CALENDAR_TIMEZONE } from '../../model/calendar.constants'
import type { CalendarSlotIntent } from '../../model/scheduling.types'
import { useWeeklyCalendarData } from '../../application/useWeeklyCalendarData.hook'
import { CalendarWeekGrid } from '../components'

interface CalendarBodyProps {
  onSlotIntent: (day: Date, startTime: string, intent: CalendarSlotIntent) => void
  selectedDate: string
}

function CalendarBody({ onSlotIntent, selectedDate }: Readonly<CalendarBodyProps>) {
  const selectedDateValue = new Date(`${selectedDate}T00:00:00`)
  const center = useAppSelector(selectSessionCenter)
  const sessionDoctor = useAppSelector(selectSessionDoctor)
  const { hasPermission } = usePermissions()
  const timezone = center?.timezone ?? DEFAULT_CALENDAR_TIMEZONE
  const selectedDoctorId = sessionDoctor?.id
  const selectedDoctorIds = useMemo(() => (selectedDoctorId ? [selectedDoctorId] : []), [selectedDoctorId])
  const calendarData = useWeeklyCalendarData({
    centerId: center?.id,
    selectedDate: selectedDateValue,
    selectedDoctorIds,
    timezone,
  })
  const canEdit = hasPermission(APP_PERMISSION_CODES.CALENDAR_EDIT)

  return (
      <CalendarWeekGrid
        canEdit={canEdit}
        items={calendarData.items}
        loading={calendarData.isLoading}
        selectedDate={selectedDateValue}
        timezone={timezone}
        onSlotIntent={onSlotIntent}
      />
  )
}

export default CalendarBody
