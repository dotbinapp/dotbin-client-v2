import { formatCostInput, parseCostInput } from '@shared/utils'
import type { PatientTreatmentPlanCreateFormInputValues } from '@domains/patients/model'
import type { PatientTreatmentPlanFrequency, PatientTreatmentPlanPaymentStatus } from '@domains/patients/model'

export const FREQUENCY_LABEL: Record<PatientTreatmentPlanFrequency, string> = {
  ANNUAL: 'Anual',
  BIWEEKLY: 'Quincenal',
  DAILY: 'Diaria',
  MONTHLY: 'Mensual',
  WEEKLY: 'Semanal',
}

export const PAYMENT_STATUS_LABEL: Record<PatientTreatmentPlanPaymentStatus, string> = {
  paid: 'Pagado',
  partial: 'Pago parcial',
  unpaid: 'No pagado',
}

export function getTodayInputValue() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function formatPlanDate(dateValue?: string) {
  if (!dateValue) return '—'

  const date = new Date(`${dateValue}T00:00:00`)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

export function parseMoneyInput(value?: string) {
  return parseCostInput(value ?? '') ?? 0
}

export function formatMoneyValue(value: number) {
  return `$${formatCostInput(value)}`
}

function addFrequencyInterval(date: Date, frequency: PatientTreatmentPlanFrequency, index: number) {
  const nextDate = new Date(date)

  if (frequency === 'DAILY') nextDate.setDate(nextDate.getDate() + index)
  if (frequency === 'WEEKLY') nextDate.setDate(nextDate.getDate() + index * 7)
  if (frequency === 'BIWEEKLY') nextDate.setDate(nextDate.getDate() + index * 14)
  if (frequency === 'MONTHLY') nextDate.setMonth(nextDate.getMonth() + index)
  if (frequency === 'ANNUAL') nextDate.setFullYear(nextDate.getFullYear() + index)

  return nextDate
}

export function getSchedulePreview(startDate: string, totalSessions: string, frequency: PatientTreatmentPlanFrequency) {
  const sessionCount = Number(totalSessions)
  const parsedStartDate = new Date(`${startDate}T00:00:00`)

  if (!startDate || Number.isNaN(parsedStartDate.getTime()) || !Number.isFinite(sessionCount) || sessionCount <= 0) {
    return []
  }

  return Array.from({ length: Math.min(sessionCount, 3) }, (_, index) => ({
    date: formatPlanDate(addFrequencyInterval(parsedStartDate, frequency, index).toISOString().split('T')[0]),
    label: `Sesión ${index + 1}`,
  }))
}

export function getEstimatedEndDate({ frequency, startDate, totalSessions }: Pick<PatientTreatmentPlanCreateFormInputValues, 'frequency' | 'startDate' | 'totalSessions'>) {
  const sessionCount = Number(totalSessions)
  const parsedStartDate = new Date(`${startDate}T00:00:00`)

  if (!startDate || Number.isNaN(parsedStartDate.getTime()) || !Number.isFinite(sessionCount) || sessionCount <= 0) {
    return '—'
  }

  const endDate = addFrequencyInterval(parsedStartDate, frequency, sessionCount - 1)
  return formatPlanDate(endDate.toISOString().split('T')[0])
}

export function getPlanCostSummary({ paidAmount, paymentStatus, totalCost, totalSessions }: Pick<PatientTreatmentPlanCreateFormInputValues, 'paidAmount' | 'paymentStatus' | 'totalCost' | 'totalSessions'>) {
  const parsedTotalCost = parseMoneyInput(totalCost)
  const parsedPaidAmount = paymentStatus === 'paid' ? parsedTotalCost : paymentStatus === 'unpaid' ? 0 : parseMoneyInput(paidAmount)
  const parsedSessions = Number(totalSessions)
  const balance = Math.max(parsedTotalCost - parsedPaidAmount, 0)
  const costPerSession = parsedSessions > 0 ? parsedTotalCost / parsedSessions : 0

  return {
    balance,
    costPerSession,
    paidAmount: parsedPaidAmount,
    totalCost: parsedTotalCost,
  }
}
