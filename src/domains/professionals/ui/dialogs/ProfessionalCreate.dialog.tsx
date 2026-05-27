import { useCallback, useState } from 'react'
import { Button } from '@shared/ui/atoms'
import { BaseDialog } from '@shared/ui/layout'
import { ProfessionalCreateForm } from '../forms'
import type { ProfessionalCreateFormValues } from '../../model'

interface ProfessionalCreateDialogProps {
  isCreating?: boolean
  isOpen: boolean
  onClose: () => void
  onCreateProfessional?: (professionalDraft: ProfessionalCreateFormValues) => Promise<boolean> | boolean
}

const PROFESSIONAL_CREATE_FORM_ID = 'professional-create-form'

function ProfessionalCreateDialog({ isCreating = false, isOpen, onClose, onCreateProfessional }: Readonly<ProfessionalCreateDialogProps>) {
  const [hasMinimumProfessionalData, setHasMinimumProfessionalData] = useState(false)

  const closeDialog = useCallback(() => {
    setHasMinimumProfessionalData(false)
    onClose()
  }, [onClose])

  const createProfessional = useCallback(
    async (professionalDraft: ProfessionalCreateFormValues) => {
      if (!onCreateProfessional) {
        closeDialog()
        return
      }

      const professionalWasSaved = await onCreateProfessional(professionalDraft)
      if (professionalWasSaved) closeDialog()
    },
    [closeDialog, onCreateProfessional],
  )

  return (
    <BaseDialog
      description="Completa el formulario para agregar un nuevo profesional al centro."
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button onClick={closeDialog} variant="ghost">
            Cancelar
          </Button>
          <Button disabled={!hasMinimumProfessionalData || isCreating} form={PROFESSIONAL_CREATE_FORM_ID} onLoading={isCreating} type="submit">
            {isCreating ? 'Creando...' : 'Crear profesional'}
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={closeDialog}
      size="lg"
      title="Nuevo profesional"
    >
      <ProfessionalCreateForm
        disabled={isCreating}
        formId={PROFESSIONAL_CREATE_FORM_ID}
        isOpen={isOpen}
        onMinimumDataChange={setHasMinimumProfessionalData}
        onValidSubmit={createProfessional}
      />
    </BaseDialog>
  )
}

export default ProfessionalCreateDialog
