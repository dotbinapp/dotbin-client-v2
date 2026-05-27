import { useCallback, useState } from 'react'
import { Button } from '@shared/ui/atoms'
import { BaseDialog } from '@shared/ui/layout'
import { PatientCreateForm } from '../forms'
import type { PatientCreateFormValues } from '../../model'

interface PatientCreateDialogProps {
  isCreating: boolean
  isOpen: boolean
  onClose: () => void
  onCreatePatient: (patientDraft: PatientCreateFormValues) => Promise<boolean>
}

const PATIENT_CREATE_FORM_ID = 'patient-create-form'

function PatientCreateDialog({ isCreating, isOpen, onClose, onCreatePatient }: Readonly<PatientCreateDialogProps>) {
  const [hasMinimumPatientData, setHasMinimumPatientData] = useState(false)

  const closeDialog = useCallback(() => {
    setHasMinimumPatientData(false)
    onClose()
  }, [onClose])

  const createPatient = useCallback(
    async (patientDraft: PatientCreateFormValues) => {
      const patientWasCreated = await onCreatePatient(patientDraft)
      if (patientWasCreated) closeDialog()
    },
    [closeDialog, onCreatePatient],
  )

  return (
    <BaseDialog
      description="Cargá los datos mínimos para dar de alta un paciente."
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button onClick={closeDialog} variant="ghost">
            Cancelar
          </Button>
          <Button disabled={!hasMinimumPatientData || isCreating} form={PATIENT_CREATE_FORM_ID} onLoading={isCreating} type="submit">
            {isCreating ? 'Creando...' : 'Crear paciente'}
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={closeDialog}
      size="lg"
      title="Nuevo paciente"
    >
      <PatientCreateForm disabled={isCreating} formId={PATIENT_CREATE_FORM_ID} isOpen={isOpen} onMinimumDataChange={setHasMinimumPatientData} onValidSubmit={createPatient} />
    </BaseDialog>
  )
}

export default PatientCreateDialog
