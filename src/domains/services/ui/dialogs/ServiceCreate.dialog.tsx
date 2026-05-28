import { useCallback, useMemo, useState } from 'react'
import { Button } from '@shared/ui/atoms'
import { BaseDialog } from '@shared/ui/layout'
import { formatCostInput } from '@shared/utils'
import { ServiceCreateForm } from '../forms'
import type { ServiceCreateFormInputValues, ServiceCreateFormValues, ServiceSummary } from '../../model'

interface ServiceCreateDialogProps {
  activeService?: ServiceSummary | null
  isCreating?: boolean
  isOpen: boolean
  isUpdating?: boolean
  onClose: () => void
  onCreateService?: (serviceDraft: ServiceCreateFormValues) => Promise<boolean> | boolean
  onUpdateService?: (serviceId: string, serviceDraft: ServiceCreateFormValues) => Promise<boolean> | boolean
}

const SERVICE_CREATE_FORM_ID = 'service-create-form'

function getServiceFormInitialValues(service: ServiceSummary): ServiceCreateFormInputValues {
  return {
    cost: formatCostInput(service.cost),
    depositAmount: service.depositAmount === null ? '' : formatCostInput(service.depositAmount),
    description: service.description ?? '',
    durationMinutes: String(service.durationMinutes),
    hasPostServiceInstructions: Boolean(service.postServiceInstructions),
    name: service.name,
    postServiceInstructions: service.postServiceInstructions ?? '',
    requiresDeposit: service.requiresDeposit,
  }
}

function ServiceCreateDialog({ activeService, isCreating = false, isOpen, isUpdating = false, onClose, onCreateService, onUpdateService }: Readonly<ServiceCreateDialogProps>) {
  const [hasMinimumServiceData, setHasMinimumServiceData] = useState(false)
  const isEditMode = Boolean(activeService)
  const isSaving = isCreating || isUpdating
  const initialValues = useMemo(() => (activeService ? getServiceFormInitialValues(activeService) : undefined), [activeService])

  const closeDialog = useCallback(() => {
    setHasMinimumServiceData(false)
    onClose()
  }, [onClose])

  const createService = useCallback(
    async (serviceDraft: ServiceCreateFormValues) => {
      if (activeService) {
        const serviceWasSaved = await onUpdateService?.(activeService.id, serviceDraft)
        if (serviceWasSaved) closeDialog()
        return
      }

      if (!onCreateService) {
        closeDialog()
        return
      }

      const serviceWasSaved = await onCreateService(serviceDraft)
      if (serviceWasSaved) closeDialog()
    },
    [activeService, closeDialog, onCreateService, onUpdateService],
  )

  return (
    <BaseDialog
      description={isEditMode ? 'Actualizá los datos del servicio.' : 'Completá los datos para crear un nuevo servicio en el centro.'}
      footer={(
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button onClick={closeDialog} variant="ghost">
            Cancelar
          </Button>
          <Button disabled={!hasMinimumServiceData || isSaving} form={SERVICE_CREATE_FORM_ID} onLoading={isSaving} type="submit">
            {isSaving ? (isEditMode ? 'Guardando...' : 'Creando...') : isEditMode ? 'Guardar cambios' : 'Crear servicio'}
          </Button>
        </div>
      )}
      isOpen={isOpen}
      onClose={closeDialog}
      size="lg"
      title={isEditMode ? 'Editar servicio' : 'Nuevo servicio'}
    >
      <ServiceCreateForm
        disabled={isSaving}
        formId={SERVICE_CREATE_FORM_ID}
        initialValues={initialValues}
        isOpen={isOpen}
        onMinimumDataChange={setHasMinimumServiceData}
        onValidSubmit={createService}
      />
    </BaseDialog>
  )
}

export default ServiceCreateDialog
