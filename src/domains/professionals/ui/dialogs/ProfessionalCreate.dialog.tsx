import { useCallback, useMemo, useState } from 'react'
import { Button } from '@shared/ui/atoms'
import { BaseDialog } from '@shared/ui/layout'
import { ProfessionalCreateForm } from '../forms'
import type { ProfessionalCreateFormInputValues, ProfessionalCreateFormValues, ProfessionalSummary } from '../../model'

interface ProfessionalCreateDialogProps {
  activeProfessional?: ProfessionalSummary | null
  isCreating?: boolean
  isOpen: boolean
  isUpdating?: boolean
  onClose: () => void
  onCreateProfessional?: (professionalDraft: ProfessionalCreateFormValues) => Promise<boolean> | boolean
  onUpdateProfessional?: (professionalId: string, professionalDraft: ProfessionalCreateFormValues) => Promise<boolean> | boolean
}

const PROFESSIONAL_CREATE_FORM_ID = 'professional-create-form'

function getProfessionalFormInitialValues(professional: ProfessionalSummary): ProfessionalCreateFormInputValues {
  return {
    email: professional.email ?? '',
    firstName: professional.firstName,
    lastName: professional.lastName,
    phone: professional.phone ?? '',
    specialty: professional.specialty ?? '',
  }
}

function ProfessionalCreateDialog({
  activeProfessional,
  isCreating = false,
  isOpen,
  isUpdating = false,
  onClose,
  onCreateProfessional,
  onUpdateProfessional,
}: Readonly<ProfessionalCreateDialogProps>) {
  const [hasMinimumProfessionalData, setHasMinimumProfessionalData] = useState(false)
  const isEditMode = Boolean(activeProfessional)
  const isSaving = isCreating || isUpdating
  const initialValues = useMemo(() => (activeProfessional ? getProfessionalFormInitialValues(activeProfessional) : undefined), [activeProfessional])

  const closeDialog = useCallback(() => {
    setHasMinimumProfessionalData(false)
    onClose()
  }, [onClose])

  const createProfessional = useCallback(
    async (professionalDraft: ProfessionalCreateFormValues) => {
      if (activeProfessional) {
        const professionalWasSaved = await onUpdateProfessional?.(activeProfessional.id, professionalDraft)
        if (professionalWasSaved) closeDialog()
        return
      }

      if (!onCreateProfessional) {
        closeDialog()
        return
      }

      const professionalWasSaved = await onCreateProfessional(professionalDraft)
      if (professionalWasSaved) closeDialog()
    },
    [activeProfessional, closeDialog, onCreateProfessional, onUpdateProfessional],
  )

  return (
    <BaseDialog
      description={isEditMode ? 'Actualizá los datos del profesional.' : 'Completá el formulario para agregar un nuevo profesional al centro.'}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button onClick={closeDialog} variant="ghost">
            Cancelar
          </Button>
          <Button disabled={!hasMinimumProfessionalData || isSaving} form={PROFESSIONAL_CREATE_FORM_ID} onLoading={isSaving} type="submit">
            {isSaving ? (isEditMode ? 'Guardando...' : 'Creando...') : isEditMode ? 'Guardar cambios' : 'Crear profesional'}
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={closeDialog}
      size="lg"
      title={isEditMode ? 'Editar profesional' : 'Nuevo profesional'}
    >
      <ProfessionalCreateForm
        disabled={isSaving}
        formId={PROFESSIONAL_CREATE_FORM_ID}
        initialValues={initialValues}
        isOpen={isOpen}
        onMinimumDataChange={setHasMinimumProfessionalData}
        onValidSubmit={createProfessional}
      />
    </BaseDialog>
  )
}

export default ProfessionalCreateDialog
