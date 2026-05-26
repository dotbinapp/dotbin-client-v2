import { Button } from '@src/shared/ui/atoms'
import { BaseDialog } from '@src/shared/ui/layout'
import AppointmentCreateForm from '../forms/AppointmentCreate.form'

interface AppointmentCreateDialogProps {
  isOpen: boolean
  onClose: () => void
}

function AppointmentCreateDialog({ isOpen, onClose }: Readonly<AppointmentCreateDialogProps>) {
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
      title="Nuevo turno"
    >
      <AppointmentCreateForm />
    </BaseDialog>
  )
}

export default AppointmentCreateDialog
