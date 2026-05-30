import { CalendarDays, Flag, Info, Sparkles, UserRound } from 'lucide-react'
import { Text } from '@shared/ui/atoms'
import { BaseContainer } from '@shared/ui/layout'
import type { PatientTreatmentPlanCreateFormInputValues } from '@domains/patients/model'
import {
  FREQUENCY_LABEL,
  PAYMENT_STATUS_LABEL,
  formatMoneyValue,
  formatPlanDate,
  getEstimatedEndDate,
  getPlanCostSummary,
} from './treatmentPlanForm.utils'

interface TreatmentPlanSummaryProps {
  patientName: string
  professionalName?: string
  treatmentName?: string
  values: Pick<PatientTreatmentPlanCreateFormInputValues, 'frequency' | 'paidAmount' | 'paymentStatus' | 'startDate' | 'totalCost' | 'totalSessions'>
}

function TreatmentPlanSummary({ patientName, professionalName, treatmentName, values }: Readonly<TreatmentPlanSummaryProps>) {
  const costSummary = getPlanCostSummary(values)
  const estimatedEndDate = getEstimatedEndDate(values)
  const sessionsCount = Number(values.totalSessions) || 0

  return (
    <BaseContainer as="aside" surface="subtle" radius="xl" className="space-y-4" padding="md">
      <div>
        <Text as="h3" variant="label" className="text-base">Resumen del plan</Text>
        <Text variant="caption">Vista previa antes de crear el plan.</Text>
      </div>

      <div className="rounded-2xl border border-ui-border bg-ui-surface p-3">
        <Text variant="caption" className="inline-flex items-center gap-2">
          <UserRound aria-hidden="true" size={16} />
          Paciente
        </Text>
        <Text variant="label">{patientName}</Text>
      </div>

      <div className="rounded-2xl border border-ui-border bg-ui-surface p-4">
        <div className="flex items-start gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-ui-primary-text dark:bg-primary-500/15 dark:text-primary-200 dark:ring-1 dark:ring-primary-300/25">
            <Sparkles aria-hidden="true" size={20} />
          </span>
          <div className="min-w-0">
            <Text variant="label" className="truncate">{treatmentName || 'Seleccioná un tratamiento'}</Text>
            <Text variant="caption">{sessionsCount > 0 ? `${sessionsCount} sesiones` : 'Sin sesiones'}</Text>
            <Text variant="caption">Frecuencia: {FREQUENCY_LABEL[values.frequency]}</Text>
            {professionalName ? <Text variant="caption">Profesional: {professionalName}</Text> : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-ui-border bg-ui-surface p-4">
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <CalendarDays aria-hidden="true" className="text-ui-primary-text" size={18} />
            <div>
              <Text variant="caption">Inicio</Text>
              <Text variant="label">{formatPlanDate(values.startDate)}</Text>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Flag aria-hidden="true" className="text-ui-primary-text" size={18} />
            <div>
              <Text variant="caption">Fin estimado</Text>
              <Text variant="label">{estimatedEndDate}</Text>
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-ui-border overflow-hidden rounded-2xl border border-ui-border bg-ui-surface">
        <div className="flex justify-between gap-3 p-3">
          <Text variant="caption">Total del plan</Text>
          <Text variant="label">{formatMoneyValue(costSummary.totalCost)}</Text>
        </div>
        <div className="flex justify-between gap-3 p-3">
          <Text variant="caption">Abonado</Text>
          <Text variant="label" tone="success">{formatMoneyValue(costSummary.paidAmount)}</Text>
        </div>
        <div className="flex justify-between gap-3 p-3">
          <Text variant="caption">Saldo</Text>
          <Text variant="label" tone={costSummary.balance > 0 ? 'danger' : 'success'}>{formatMoneyValue(costSummary.balance)}</Text>
        </div>
        <div className="flex justify-between gap-3 p-3">
          <Text variant="caption">Costo por sesión</Text>
          <Text variant="label">{formatMoneyValue(costSummary.costPerSession)}</Text>
        </div>
      </div>

      <div className="rounded-2xl border border-primary-200 bg-primary-50/60 p-4 dark:border-primary-400/30 dark:bg-primary-500/15">
        <Text variant="caption" className="flex items-start gap-2 text-ui-primary-text">
          <Info aria-hidden="true" className="mt-0.5 shrink-0" size={16} />
          Se generarán {sessionsCount || 0} sesiones estimadas. Estado de pago: {PAYMENT_STATUS_LABEL[values.paymentStatus]}.
        </Text>
      </div>
    </BaseContainer>
  )
}

export default TreatmentPlanSummary
