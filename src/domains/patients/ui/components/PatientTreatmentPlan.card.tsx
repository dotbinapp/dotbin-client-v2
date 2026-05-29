import type { PatientTreatmentPlan } from '@domains/patients/model'
import { Pill, Text } from '@shared/ui/atoms'
import { composeClassName } from '@shared/ui/utils/className.utils'
import { formatCostInput } from '@shared/utils'
import { CalendarDays, CheckCircle2, ChevronRight, Clock, FileText, ReceiptText, Sparkles, XCircle } from 'lucide-react'

type PatientTreatmentPlanCardVariant = 'compact' | 'extended'

interface PatientTreatmentPlanCardProps {
  onSelect?: (plan: PatientTreatmentPlan) => void
  plan: PatientTreatmentPlan
  variant?: PatientTreatmentPlanCardVariant
}

const FREQUENCY_LABEL: Record<NonNullable<PatientTreatmentPlan['frequency']>, string> = {
  ANNUAL: 'Anual',
  BIWEEKLY: 'Quincenal',
  DAILY: 'Diaria',
  MONTHLY: 'Mensual',
  WEEKLY: 'Semanal',
}

function getProgressPercent(plan: PatientTreatmentPlan) {
  if (plan.totalSessions <= 0) return 0

  return Math.min(100, Math.max(0, Math.round((plan.completedSessions / plan.totalSessions) * 100)))
}

function getPlanStatusLabel(plan: PatientTreatmentPlan) {
  if (plan.status === 'COMPLETED' || plan.completedSessions >= plan.totalSessions) return 'Finalizado'

  return plan.completedSessions > 0 ? 'En curso' : 'Activa'
}

function getPlanStatusClass(plan: PatientTreatmentPlan) {
  if (plan.status === 'COMPLETED' || plan.completedSessions >= plan.totalSessions) return 'border-slate-200 bg-slate-100 text-slate-700'

  return plan.completedSessions > 0 ? 'border-sky-200 bg-sky-100 text-sky-700' : 'border-emerald-200 bg-emerald-100 text-emerald-700'
}

function PlanStatusPill({ className = '', plan }: Readonly<{ className?: string; plan: PatientTreatmentPlan }>) {
  return (
    <Pill
      as='span'
      className={className}
      inactiveClassName={getPlanStatusClass(plan)}
    >
      {getPlanStatusLabel(plan)}
    </Pill>
  )
}

function formatPlanDate(date: string | null) {
  if (!date) return 'Sin fecha'

  const planDate = new Date(date)
  if (Number.isNaN(planDate.getTime())) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(planDate)
}

function PatientTreatmentPlanCard({ onSelect, plan, variant = 'compact' }: Readonly<PatientTreatmentPlanCardProps>) {
  const progressPercent = getProgressPercent(plan)

  if (variant === 'extended') {
    return (
      <article className="rounded-3xl border border-ui-border bg-ui-surface p-5 shadow-[var(--theme-shadow-surface)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                <Sparkles aria-hidden="true" size={20} />
              </div>
              <div className="min-w-0">
                <Text as="h3" variant="label" className="truncate text-base">{plan.serviceName}</Text>
                <Text variant="caption">Sesión {plan.completedSessions} de {plan.totalSessions}</Text>
              </div>
            </div>
            <PlanStatusPill plan={plan} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-ui-text-muted">
              <span>Progreso</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-ui-surface-muted" role="progressbar" aria-label={`Progreso de ${plan.serviceName}`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={progressPercent}>
              <div className="h-full rounded-full bg-primary-500 transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="grid gap-3 text-sm text-ui-text-muted sm:grid-cols-2">
            <span className="inline-flex items-center gap-2"><CalendarDays aria-hidden="true" size={16} />{formatPlanDate(plan.startDate)}</span>
            <span className="inline-flex items-center gap-2"><Clock aria-hidden="true" size={16} />{plan.frequency ? FREQUENCY_LABEL[plan.frequency] : 'Sin frecuencia'}</span>
            {plan.totalCost !== null ? <span className="inline-flex items-center gap-2"><ReceiptText aria-hidden="true" size={16} />${formatCostInput(plan.totalCost)}</span> : null}
            {plan.isPaid !== null ? (
              <span className={composeClassName('inline-flex items-center gap-2 font-bold', plan.isPaid ? 'text-emerald-700' : 'text-red-700')}>
                {plan.isPaid ? <CheckCircle2 aria-hidden="true" size={16} /> : <XCircle aria-hidden="true" size={16} />}
                {plan.isPaid ? 'Pago' : 'Pendiente'}
              </span>
            ) : null}
          </div>

          {plan.notes ? (
            <div className="rounded-2xl border border-ui-border bg-ui-surface-muted p-3 text-sm text-ui-text-muted">
              <span className="mb-1 inline-flex items-center gap-2 font-bold text-ui-text"><FileText aria-hidden="true" size={16} />Notas</span>
              <p>{plan.notes}</p>
            </div>
          ) : null}
        </div>
      </article>
    )
  }

  const content = (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
          <Sparkles aria-hidden="true" size={18} />
        </div>
        <div className="min-w-0 text-left">
          <Text as="h3" variant="label" className="truncate">{plan.serviceName}</Text>
          <Text variant="caption">Sesión {plan.completedSessions} de {plan.totalSessions}</Text>
        </div>
      </div>

      <PlanStatusPill className="hidden sm:inline-flex" plan={plan} />

      <div className="hidden min-w-28 flex-1 items-center gap-3 md:flex">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ui-surface-muted" role="progressbar" aria-label={`Progreso de ${plan.serviceName}`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={progressPercent}>
          <div className="h-full rounded-full bg-primary-500 transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <span className="shrink-0 text-sm font-bold tabular-nums text-ui-text-muted">{progressPercent}%</span>
      {onSelect ? <ChevronRight aria-hidden="true" className="shrink-0 text-ui-text-muted" size={18} /> : null}
    </>
  )

  if (onSelect) {
    return (
      <button
        aria-label={`Ver plan ${plan.serviceName}`}
        className="flex w-full items-center gap-4 px-3 py-3 text-left transition-colors hover:bg-ui-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
        onClick={() => onSelect(plan)}
        type="button"
      >
        {content}
      </button>
    )
  }

  return <article className="flex items-center gap-4 px-3 py-3">{content}</article>
}

export default PatientTreatmentPlanCard
