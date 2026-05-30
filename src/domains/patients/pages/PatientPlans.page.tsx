import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ClipboardList, CheckCircle2, Plus, ReceiptText, Sparkles, Trash2 } from 'lucide-react'
import type { PatientTreatmentPlan, PatientTreatmentPlanCreatePayload, PatientTreatmentPlanPaymentStatus, PatientTreatmentPlanUpdatePayload } from '@domains/patients/model'
import { Button, StatCard, Text } from '@shared/ui/atoms'
import { toast } from '@shared/ui/feedback'
import { AsyncSectionContainer } from '@shared/ui/layout'
import { ConfirmModal } from '@shared/ui/molecules'
import { usePatientTreatmentPlansQuery } from '../queries/patientTreatmentPlans.query'
import { usePatientTreatmentPlanCreateMutation } from '../queries/patientTreatmentPlanCreate.mutation'
import { usePatientTreatmentPlansUpdateMutation } from '../queries/patientTreatmentPlansUpdate.mutation'
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

function getTreatmentPlanPaymentStatus(plan: PatientTreatmentPlan): PatientTreatmentPlanPaymentStatus {
  if (plan.isPaid) return 'paid'
  if ((plan.paidAmount ?? 0) > 0) return 'partial'

  return 'unpaid'
}

function getTreatmentPlanTreatmentIds(plan: PatientTreatmentPlan) {
  return plan.treatments.length ? plan.treatments.map((treatment) => treatment.id) : [plan.serviceId]
}

function mapTreatmentPlanToUpdatePayload(plan: PatientTreatmentPlan): PatientTreatmentPlanUpdatePayload {
  return {
    completedSessions: plan.completedSessions,
    frequency: plan.frequency,
    id: plan.id,
    notes: plan.notes,
    paidAmount: plan.paidAmount,
    paymentStatus: getTreatmentPlanPaymentStatus(plan),
    professionalId: plan.professional?.id ?? null,
    startDate: plan.startDate,
    status: plan.status,
    totalCost: plan.totalCost,
    totalSessions: plan.totalSessions,
    treatmentIds: getTreatmentPlanTreatmentIds(plan),
  }
}

function mapPlanDraftToUpdatePayload(plan: PatientTreatmentPlan, planDraft: PatientTreatmentPlanCreatePayload): PatientTreatmentPlanUpdatePayload {
  return {
    completedSessions: plan.completedSessions,
    frequency: planDraft.frequency,
    id: plan.id,
    notes: planDraft.notes ?? null,
    paidAmount: planDraft.paidAmount,
    paymentStatus: planDraft.paymentStatus,
    professionalId: planDraft.professionalId ?? null,
    startDate: planDraft.startDate,
    status: plan.status,
    totalCost: planDraft.totalCost,
    totalSessions: planDraft.totalSessions,
    treatmentIds: planDraft.treatmentIds,
  }
}

function replaceTreatmentPlan(plans: PatientTreatmentPlan[], updatedPlan: PatientTreatmentPlanUpdatePayload) {
  return plans.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : mapTreatmentPlanToUpdatePayload(plan)))
}

function PatientPlansPage() {
  const { canViewPatient, centerId, getAccessToken, patient, patientId } = useOutletContext<PatientDetailOutletContext>()
  const [isNewPlanDialogOpen, setIsNewPlanDialogOpen] = useState(false)
  const [planToEdit, setPlanToEdit] = useState<PatientTreatmentPlan | null>(null)
  const [planToDelete, setPlanToDelete] = useState<PatientTreatmentPlan | null>(null)
  const [planToMarkAsCompleted, setPlanToMarkAsCompleted] = useState<PatientTreatmentPlan | null>(null)
  const [planToMarkAsPaid, setPlanToMarkAsPaid] = useState<PatientTreatmentPlan | null>(null)
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
  const updateTreatmentPlansMutation = usePatientTreatmentPlansUpdateMutation({
    centerId,
    getAccessToken,
    patientId,
  })
  const plans = sortPlansByCreationDate(treatmentPlansQuery.data)
  const activePlansCount = plans.filter(isActivePlan).length
  const completedPlansCount = plans.length - activePlansCount
  const patientName = patient?.fullName ?? 'Paciente'
  const closePlanDialog = () => {
    setIsNewPlanDialogOpen(false)
    setPlanToEdit(null)
  }
  const openCreatePlanDialog = () => {
    setPlanToEdit(null)
    setIsNewPlanDialogOpen(true)
  }
  const openEditPlanDialog = (plan: PatientTreatmentPlan) => {
    if (plan.status === 'COMPLETED') {
      toast.warning('No se puede editar el plan', {
        description: 'Los planes finalizados no se pueden editar.',
      })
      return
    }

    setPlanToEdit(plan)
    setIsNewPlanDialogOpen(true)
  }
  const savePlan = async (planDraft: PatientTreatmentPlanCreatePayload) => {
    try {
      if (planToEdit) {
        const updatedPlan = mapPlanDraftToUpdatePayload(planToEdit, planDraft)
        await updateTreatmentPlansMutation.mutateAsync(replaceTreatmentPlan(plans, updatedPlan))
        toast.success('Plan actualizado', {
          description: 'Los cambios del plan se guardaron correctamente.',
        })
        return true
      }

      await createTreatmentPlanMutation.mutateAsync(planDraft)
      toast.success('Plan creado', { description: `El plan de ${patientName} se creó correctamente.` })
      return true
    } catch (error) {
      toast.error(planToEdit ? 'No se pudo editar el plan' : 'No se pudo crear el plan', {
        description: getTreatmentPlanCreateErrorMessage(error),
      })
      return false
    }
  }
  const markPlanAsCompleted = async () => {
    if (!planToMarkAsCompleted) return

    try {
      await updateTreatmentPlansMutation.mutateAsync(replaceTreatmentPlan(plans, {
        ...mapTreatmentPlanToUpdatePayload(planToMarkAsCompleted),
        status: 'COMPLETED',
      }))
      toast.success('Plan finalizado', { description: 'El plan se marcó como finalizado.' })
      setPlanToMarkAsCompleted(null)
    } catch (error) {
      toast.error('No se pudo finalizar el plan', { description: getTreatmentPlanCreateErrorMessage(error) })
    }
  }
  const markPlanAsPaid = async () => {
    if (!planToMarkAsPaid) return

    const totalCost = planToMarkAsPaid.totalCost ?? 0

    try {
      await updateTreatmentPlansMutation.mutateAsync(replaceTreatmentPlan(plans, {
        ...mapTreatmentPlanToUpdatePayload(planToMarkAsPaid),
        paidAmount: totalCost,
        paymentStatus: 'paid',
        totalCost,
      }))
      toast.success('Plan marcado como pagado', { description: 'El monto abonado se igualó al costo total.' })
      setPlanToMarkAsPaid(null)
    } catch (error) {
      toast.error('No se pudo marcar como pagado', { description: getTreatmentPlanCreateErrorMessage(error) })
    }
  }
  const deletePlan = async () => {
    if (!planToDelete) return

    try {
      await updateTreatmentPlansMutation.mutateAsync(plans
        .filter((plan) => plan.id !== planToDelete.id)
        .map(mapTreatmentPlanToUpdatePayload))
      toast.success('Plan eliminado', { description: 'El plan se eliminó correctamente.' })
      setPlanToDelete(null)
    } catch (error) {
      toast.error('No se pudo eliminar el plan', { description: getTreatmentPlanCreateErrorMessage(error) })
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

          <Button Icon={Plus} onClick={openCreatePlanDialog} size="sm">
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
              <PatientTreatmentPlanCard
                key={plan.id}
                onDelete={setPlanToDelete}
                onEdit={openEditPlanDialog}
                onMarkAsCompleted={setPlanToMarkAsCompleted}
                onMarkAsPaid={setPlanToMarkAsPaid}
                plan={plan}
                variant={plan.status === 'COMPLETED' ? 'collapsed' : 'extended'}
              />
            ))}
          </div>
        ) : null}
      </AsyncSectionContainer>

      <PatientTreatmentPlanCreateDialog
        centerId={centerId}
        getAccessToken={getAccessToken}
        initialPlan={planToEdit}
        isOpen={isNewPlanDialogOpen}
        isSaving={createTreatmentPlanMutation.isPending || updateTreatmentPlansMutation.isPending}
        onClose={closePlanDialog}
        onSavePlan={savePlan}
        patientName={patientName}
      />

      {planToMarkAsCompleted ? (
        <ConfirmModal
          Icon={CheckCircle2}
          description="El plan pasará a estado finalizado. Esta acción no modifica las sesiones completadas."
          loading={updateTreatmentPlansMutation.isPending}
          onClose={() => setPlanToMarkAsCompleted(null)}
          onConfirm={() => void markPlanAsCompleted()}
          title="¿Finalizar plan?"
        />
      ) : null}

      {planToMarkAsPaid ? (
        <ConfirmModal
          Icon={ReceiptText}
          description="El monto abonado se igualará al costo total del plan."
          loading={updateTreatmentPlansMutation.isPending}
          onClose={() => setPlanToMarkAsPaid(null)}
          onConfirm={() => void markPlanAsPaid()}
          title="¿Marcar como pagado?"
        />
      ) : null}

      {planToDelete ? (
        <ConfirmModal
          Icon={Trash2}
          description="El plan se eliminará del historial del paciente. Esta acción no se puede deshacer."
          loading={updateTreatmentPlansMutation.isPending}
          onClose={() => setPlanToDelete(null)}
          onConfirm={() => void deletePlan()}
          primaryAction="danger"
          title="¿Eliminar plan?"
        />
      ) : null}
    </>
  )
}

export default PatientPlansPage
