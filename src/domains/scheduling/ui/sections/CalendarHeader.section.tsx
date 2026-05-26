import { useState } from 'react'
import { CalendarPlus, Plus, Lock } from 'lucide-react'
import { APP_PERMISSION_CODES, usePermissions } from '@domains/identity-access'
import { MenuButton } from '@shared/ui/molecules'
import { WeekPicker } from '../components'
import { AppointmentCreateDialog } from '../dialogs'
import type { CalendarSlotIntent } from '../../model/scheduling.types'

interface SlotSelection {
  date: string
  intent: CalendarSlotIntent
  startTime: string
}

interface CalendarHeaderProps {
  onDateChange: (date: string) => void
  onSlotSelectionConsumed: () => void
  selectedDate: string
  slotSelection: SlotSelection | null
}

function CalendarHeader({ onDateChange, onSlotSelectionConsumed, selectedDate, slotSelection }: Readonly<CalendarHeaderProps>) {
  const { hasPermission } = usePermissions()

  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
  const [creationIntent, setCreationIntent] = useState<CalendarSlotIntent>('appointment')
  const canCreateAppointment = hasPermission(APP_PERMISSION_CODES.CALENDAR_EDIT)

  const creationOptions = [
    {
      Icon: CalendarPlus,
      label: 'Nuevo turno',
      onSelect: () => {
        setCreationIntent('appointment')
        setIsAppointmentDialogOpen(true)
      },
    },
    {
      Icon: Lock,
      label: 'Nuevo bloqueo',
      onSelect: () => {
        setCreationIntent('block')
        setIsAppointmentDialogOpen(true)
      },
    },
  ]

  return (
    <>
      <div className="flex flex-row justify-between">
        <WeekPicker onChange={onDateChange} value={selectedDate} />

        {canCreateAppointment ? (
          <MenuButton
            Icon={Plus}
            options={creationOptions}
            variant="primary"
          >
            Nuevo
          </MenuButton>
        ) : null}
      </div>

      <AppointmentCreateDialog
        initialValues={slotSelection ?? { date: selectedDate, intent: creationIntent, startTime: '' }}
        isOpen={isAppointmentDialogOpen || Boolean(slotSelection)}
        onClose={() => {
          setIsAppointmentDialogOpen(false)
          onSlotSelectionConsumed()
        }}
      />
    </>
  )
}

export default CalendarHeader
