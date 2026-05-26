import { useState } from 'react'
import { CalendarPlus, Plus, Lock } from 'lucide-react'
import { APP_PERMISSION_CODES, usePermissions } from '@src/domains/identity-access'
import { MenuButton } from '@src/shared/ui/molecules'
import { WeekPicker } from '../components'
import { AppointmentCreateDialog } from '../dialogs'
import { toIsoDateValue } from '../../utils/weekPicker.utils'

function CalendarHeader() {
  const { hasPermission } = usePermissions()

  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => toIsoDateValue(new Date()))
  const canCreateAppointment = hasPermission(APP_PERMISSION_CODES.CALENDAR_EDIT)

  const creationOptions = [
    {
      Icon: CalendarPlus,
      label: 'Nuevo turno',
      onSelect: () => setIsAppointmentDialogOpen(true),
    },
    {
      Icon: Lock,
      label: 'Nuevo bloqueo',
      onSelect: () => undefined,
    },
  ]

  return (
    <>
      <div className="flex flex-row justify-between">
        <WeekPicker onChange={setSelectedDate} value={selectedDate} />

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

      <AppointmentCreateDialog isOpen={isAppointmentDialogOpen} onClose={() => setIsAppointmentDialogOpen(false)} />
    </>
  )
}

export default CalendarHeader
