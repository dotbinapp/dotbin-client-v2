import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ClipboardList, CheckCircle2, Plus, Sparkles } from 'lucide-react'
import type { PatientTreatmentPlan, PatientTreatmentPlanCreatePayload } from '@domains/patients/model'
import { Button, StatCard, Text } from '@shared/ui/atoms'
import { toast } from '@shared/ui/feedback'
import { AsyncSectionContainer } from '@shared/ui/layout'
import { usePatientTreatmentPlansQuery } from '../queries/patientTreatmentPlans.query'
import { usePatientTreatmentPlanCreateMutation } from '../queries/patientTreatmentPlanCreate.mutation'
import { PatientTreatmentPlanCreateDialog } from '../ui/dialogs'
import { PatientTreatmentPlanCard } from '../ui/components'
import type { PatientDetailOutletContext } from './PatientDetail.page'

function isActivePlan(plan: PatientTreatmentPlan) {
  return plan.status === 'ACTIVE' && plan.completedSessions < plan.totalSessions
}

function getPlanTime(plan: PatientTreatmentPlan) {
  const timeSource = plan.createdAt ?? plan.startDate
  if (!timeSource) return 0

  const time = new Date(timeSource).getTime()
  return Number.isNaN(time) ? 0 : time
}

function sortPlansByCreationDate(plans: PatientTreatmentPlan[] = []) {
  return [...plans].sort((currentPlan, nextPlan) => getPlanTime(nextPlan) - getPlanTime(currentPlan))
}

function getTreatmentPlanCreateErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) return error.message

  return 'Revisá los datos e intentá de nuevo.'
}

function PatientPlansPage() {
  const { canViewPatient, centerId, getAccessToken, patient, patientId } = useOutletContext<PatientDetailOutletContext>()
  const [isNewPlanDialogOpen, setIsNewPlanDialogOpen] = useState(false)
  const treatmentPlansQuery = usePatientTreatmentPlansQuery({
    canViewPatient,
    centerId,
    getAccessToken,
    patientId,
  })
  const createTreatmentPlanMutation = usePatientTreatmentPlanCreateMutation({
    centerId,
    getAccessToken,
    patientId,
  })
  const plans = sortPlansByCreationDate(treatmentPlansQuery.data)
  const activePlansCount = plans.filter(isActivePlan).length
  const completedPlansCount = plans.length - activePlansCount
  const patientName = patient?.fullName ?? 'Paciente'
  const createPlan = async (planDraft: PatientTreatmentPlanCreatePayload) => {
    try {
      await createTreatmentPlanMutation.mutateAsync(planDraft)
      toast.success('Plan creado', {
        description: `El plan de ${patientName} se creó correctamente.`,
      })
      return true
    } catch (error) {
      toast.error('No se pudo crear el plan', {
        description: getTreatmentPlanCreateErrorMessage(error),
      })
      return false
    }
  }

  return (
    <>
      <AsyncSectionContainer
        surface="solid"
        radius="xl"
        className="flex flex-col gap-5"
        isError={treatmentPlansQuery.isError}
        isLoading={treatmentPlansQuery.isLoading}
        errorMessage="No se pudo cargar el historial de planes."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Text as="h2" variant="label" className="text-lg">Historial de planes</Text>
            <Text variant="caption">Todos los planes creados para este paciente.</Text>
          </div>

          <Button Icon={Plus} onClick={() => setIsNewPlanDialogOpen(true)} size="sm">
            Nuevo plan
          </Button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-3">
          <StatCard Icon={ClipboardList} label="Total planes" padding="sm" title={plans.length} />
          <StatCard Icon={Sparkles} iconClassName="text-sky-700 dark:text-sky-200" iconContainerClassName="size-11 rounded-full bg-sky-100 dark:bg-sky-500/15 dark:ring-1 dark:ring-sky-300/25" label="Activos" padding="sm" title={activePlansCount} />
          <StatCard Icon={CheckCircle2} iconClassName="text-emerald-700 dark:text-emerald-200" iconContainerClassName="size-11 rounded-full bg-emerald-100 dark:bg-emerald-500/15 dark:ring-1 dark:ring-emerald-300/25" label="Finalizados" padding="sm" title={completedPlansCount} />
        </div>

        {plans.length === 0 ? (
          <div className="rounded-2xl border border-ui-border bg-ui-surface-muted p-8 text-center">
            <Text variant="body" tone="muted">No hay planes registrados.</Text>
          </div>
        ) : null}

        {plans.length > 0 ? (
          <div className="grid gap-4">
            {plans.map((plan) => (
              <PatientTreatmentPlanCard key={plan.id} plan={plan} variant="extended" />
            ))}
          </div>
        ) : null}
      </AsyncSectionContainer>

      <PatientTreatmentPlanCreateDialog
        centerId={centerId}
        getAccessToken={getAccessToken}
        isOpen={isNewPlanDialogOpen}
        isSaving={createTreatmentPlanMutation.isPending}
        onClose={() => setIsNewPlanDialogOpen(false)}
        onCreatePlan={createPlan}
        patientName={patientName}
      />
    </>
  )
}

export default PatientPlansPage
