import { Button } from '@src/shared/ui/atoms'
import { BaseDialog } from '@src/shared/ui/layout'
import AppointmentCreateForm from '../forms/AppointmentCreate.form'

interface AppointmentCreateDialogProps {
  initialValues?: {
    date: string
    intent: string
    startTime: string
  }
  isOpen: boolean
  onClose: () => void
}

function AppointmentCreateDialog({ initialValues, isOpen, onClose }: Readonly<AppointmentCreateDialogProps>) {
  const title = initialValues?.intent === 'block' ? 'Nuevo bloqueo' : 'Nuevo turno'

  return (
    <BaseDialog
      description="Completá los datos del turno."
      footer={
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="ghost">
            Cancelar
          </Button>
          <Button type="button">
            Confirmar
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={title}
    >
      <AppointmentCreateForm initialValues={initialValues} />
    </BaseDialog>
  )
}

export default AppointmentCreateDialog
