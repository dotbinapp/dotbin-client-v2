import { useCallback, useState } from 'react'
import { Button } from '@shared/ui/atoms'
import { BaseDialog } from '@shared/ui/layout'
import { ServiceCreateForm } from '../forms'
import type { ServiceCreateFormValues } from '../../model'

interface ServiceCreateDialogProps {
  isCreating?: boolean
  isOpen: boolean
  onClose: () => void
  onCreateService?: (serviceDraft: ServiceCreateFormValues) => Promise<boolean> | boolean
}

const SERVICE_CREATE_FORM_ID = 'service-create-form'

function ServiceCreateDialog({ isCreating = false, isOpen, onClose, onCreateService }: Readonly<ServiceCreateDialogProps>) {
  const [hasMinimumServiceData, setHasMinimumServiceData] = useState(false)

  const closeDialog = useCallback(() => {
    setHasMinimumServiceData(false)
    onClose()
  }, [onClose])

  const createService = useCallback(
    async (serviceDraft: ServiceCreateFormValues) => {
      if (!onCreateService) {
        closeDialog()
        return
      }

      const serviceWasSaved = await onCreateService(serviceDraft)
      if (serviceWasSaved) closeDialog()
    },
    [closeDialog, onCreateService],
  )

  return (
    <BaseDialog
      description="Completá los datos para crear un nuevo servicio en el centro."
      footer={(
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button onClick={closeDialog} variant="ghost">
            Cancelar
          </Button>
          <Button disabled={!hasMinimumServiceData || isCreating} form={SERVICE_CREATE_FORM_ID} onLoading={isCreating} type="submit">
            {isCreating ? 'Creando...' : 'Crear servicio'}
          </Button>
        </div>
      )}
      isOpen={isOpen}
      onClose={closeDialog}
      size="lg"
      title="Nuevo servicio"
    >
      <ServiceCreateForm
        disabled={isCreating}
        formId={SERVICE_CREATE_FORM_ID}
        isOpen={isOpen}
        onMinimumDataChange={setHasMinimumServiceData}
        onValidSubmit={createService}
      />
    </BaseDialog>
  )
}

export default ServiceCreateDialog
