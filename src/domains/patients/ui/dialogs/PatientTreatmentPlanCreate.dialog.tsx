import { useCallback, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { Button } from '@shared/ui/atoms'
import { BaseDialog } from '@shared/ui/layout'
import { usePatientTreatmentPlanCreateLookups } from '../../application'
import { PatientTreatmentPlanCreateForm } from '../forms'
import type { PatientTreatmentPlanCreateFormValues } from '../../model'

interface PatientTreatmentPlanCreateDialogProps {
  centerId?: string
  getAccessToken: () => Promise<string>
  isOpen: boolean
  isSaving?: boolean
  onClose: () => void
  onCreatePlan?: (planDraft: PatientTreatmentPlanCreateFormValues) => Promise<boolean> | boolean
  patientName: string
}

const PATIENT_TREATMENT_PLAN_CREATE_FORM_ID = 'patient-treatment-plan-create-form'

function PatientTreatmentPlanCreateDialog({
  centerId,
  getAccessToken,
  isOpen,
  isSaving = false,
  onClose,
  onCreatePlan,
  patientName,
}: Readonly<PatientTreatmentPlanCreateDialogProps>) {
  const [hasMinimumPlanData, setHasMinimumPlanData] = useState(false)
  const { minSearchLength, professionalLookup, serviceLookup } = usePatientTreatmentPlanCreateLookups({
    centerId,
    getAccessToken,
    isEnabled: isOpen,
  })

  const closeDialog = useCallback(() => {
    setHasMinimumPlanData(false)
    onClose()
  }, [onClose])

  const createPlan = useCallback(
    async (planDraft: PatientTreatmentPlanCreateFormValues) => {
      const planWasCreated = onCreatePlan ? await onCreatePlan(planDraft) : true
      if (planWasCreated) closeDialog()
    },
    [closeDialog, onCreatePlan],
  )

  return (
    <BaseDialog
      description="Configurá las sesiones, frecuencia y condiciones del plan."
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button onClick={closeDialog} variant="ghost">
            Cancelar
          </Button>
          <Button disabled={!hasMinimumPlanData || isSaving} form={PATIENT_TREATMENT_PLAN_CREATE_FORM_ID} onLoading={isSaving} type="submit">
            Crear plan
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={closeDialog}
      size="2xl"
      title={
        <span className="inline-flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary-100 text-ui-primary-text dark:bg-primary-500/15 dark:text-primary-200 dark:ring-1 dark:ring-primary-300/25">
            <ClipboardList aria-hidden="true" size={22} />
          </span>
          Nuevo plan de tratamiento
        </span>
      }
    >
      <PatientTreatmentPlanCreateForm
        disabled={isSaving}
        formId={PATIENT_TREATMENT_PLAN_CREATE_FORM_ID}
        isOpen={isOpen}
        key={isOpen ? 'open-treatment-plan-form' : 'closed-treatment-plan-form'}
        minSearchLength={minSearchLength}
        onMinimumDataChange={setHasMinimumPlanData}
        onValidSubmit={createPlan}
        patientName={patientName}
        professionalLookup={professionalLookup}
        serviceLookup={serviceLookup}
      />
    </BaseDialog>
  )
}

export default PatientTreatmentPlanCreateDialog
