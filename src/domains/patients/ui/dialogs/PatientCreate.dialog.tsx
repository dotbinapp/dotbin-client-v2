import { useCallback, useMemo, useState } from 'react'
import { Button } from '@shared/ui/atoms'
import { BaseDialog } from '@shared/ui/layout'
import { PatientCreateForm } from '../forms'
import type { PatientCreateFormInputValues, PatientCreateFormValues, PatientSummary } from '../../model'

interface PatientCreateDialogProps {
  activePatient?: PatientSummary | null
  isCreating: boolean
  isOpen: boolean
  isUpdating: boolean
  onClose: () => void
  onCreatePatient: (patientDraft: PatientCreateFormValues) => Promise<boolean>
  onUpdatePatient: (patientId: string, patientDraft: PatientCreateFormValues) => Promise<boolean>
}

const PATIENT_CREATE_FORM_ID = 'patient-create-form'

function getPatientFormInitialValues(patient: PatientSummary): PatientCreateFormInputValues {
  return {
    dateOfBirth: patient.dateOfBirth?.split('T')[0] ?? '',
    documentNumber: patient.documentNumber ?? '',
    email: patient.email ?? '',
    firstName: patient.firstName,
    gender: patient.gender ?? '',
    instagramAccount: patient.instagramAccount ?? '',
    lastName: patient.lastName,
    phone: patient.phone ?? '',
  }
}

function PatientCreateDialog({ activePatient, isCreating, isOpen, isUpdating, onClose, onCreatePatient, onUpdatePatient }: Readonly<PatientCreateDialogProps>) {
  const [hasMinimumPatientData, setHasMinimumPatientData] = useState(false)
  const isEditMode = Boolean(activePatient)
  const isSaving = isCreating || isUpdating
  const initialValues = useMemo(() => (activePatient ? getPatientFormInitialValues(activePatient) : undefined), [activePatient])

  const closeDialog = useCallback(() => {
    setHasMinimumPatientData(false)
    onClose()
  }, [onClose])

  const createPatient = useCallback(
    async (patientDraft: PatientCreateFormValues) => {
      const patientWasSaved = activePatient ? await onUpdatePatient(activePatient.id, patientDraft) : await onCreatePatient(patientDraft)
      if (patientWasSaved) closeDialog()
    },
    [activePatient, closeDialog, onCreatePatient, onUpdatePatient],
  )

  return (
    <BaseDialog
      description={isEditMode ? 'Actualizá los datos del paciente.' : 'Cargá los datos mínimos para dar de alta un paciente.'}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button onClick={closeDialog} variant="ghost">
            Cancelar
          </Button>
          <Button disabled={!hasMinimumPatientData || isSaving} form={PATIENT_CREATE_FORM_ID} onLoading={isSaving} type="submit">
            {isSaving ? (isEditMode ? 'Guardando...' : 'Creando...') : isEditMode ? 'Guardar cambios' : 'Crear paciente'}
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={closeDialog}
      size="lg"
      title={isEditMode ? 'Editar paciente' : 'Nuevo paciente'}
    >
      <PatientCreateForm
        disabled={isSaving}
        formId={PATIENT_CREATE_FORM_ID}
        initialValues={initialValues}
        isOpen={isOpen}
        onMinimumDataChange={setHasMinimumPatientData}
        onValidSubmit={createPatient}
      />
    </BaseDialog>
  )
}

export default PatientCreateDialog
