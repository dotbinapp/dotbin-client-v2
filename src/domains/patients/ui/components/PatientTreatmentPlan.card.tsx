import type { PatientTreatmentPlan } from '@domains/patients/model'
import { Pill, Text } from '@shared/ui/atoms'
import { MenuButton } from '@shared/ui/molecules'
import type { MenuButtonOption } from '@shared/ui/molecules'
import { formatCostInput } from '@shared/utils'
import { CalendarDays, CheckCircle2, ChevronDown, ChevronRight, Clock, FileText, MoreVertical, Pencil, ReceiptText, Sparkles, Trash2, UserRound, WalletCards, XCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useId, useState } from 'react'

type PatientTreatmentPlanCardVariant = 'collapsed' | 'compact' | 'extended'

interface PatientTreatmentPlanCardProps {
  onDelete?: (plan: PatientTreatmentPlan) => void
  onEdit?: (plan: PatientTreatmentPlan) => void
  onMarkAsCompleted?: (plan: PatientTreatmentPlan) => void
  onMarkAsPaid?: (plan: PatientTreatmentPlan) => void
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
  if (plan.status === 'COMPLETED' || plan.completedSessions >= plan.totalSessions) return 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-400/35 dark:bg-slate-500/15 dark:text-slate-200'

  return plan.completedSessions > 0 ? 'border-sky-200 bg-sky-100 text-sky-700 dark:border-sky-400/35 dark:bg-sky-500/15 dark:text-sky-200' : 'border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/15 dark:text-emerald-200'
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

function PaymentStatusPill({ isPaid }: Readonly<{ isPaid: boolean | null }>) {
  if (isPaid === null) return <Text variant="caption">Sin estado de pago</Text>

  return (
    <Pill
      as="span"
      dotClassName={isPaid ? 'bg-emerald-600 dark:bg-emerald-300' : 'bg-red-600 dark:bg-red-300'}
      inactiveClassName={isPaid ? 'border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/15 dark:text-emerald-200' : 'border-red-200 bg-red-100 text-red-700 dark:border-red-400/35 dark:bg-red-500/15 dark:text-red-200'}
    >
      {isPaid ? 'Pago' : 'Pendiente'}
    </Pill>
  )
}

function TreatmentChips({ plan }: Readonly<{ plan: PatientTreatmentPlan }>) {
  const treatments = plan.treatments.length ? plan.treatments : [{ id: plan.serviceId, name: plan.serviceName }]

  return (
    <div className="flex flex-wrap gap-2" aria-label="Tratamientos del plan">
      {treatments.map((treatment) => (
        <Pill as="span" key={treatment.id} inactiveClassName="border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-400/30 dark:bg-primary-500/15 dark:text-primary-200">
          {treatment.name}
        </Pill>
      ))}
    </div>
  )
}

function PlanDetailItem({ children, Icon, label }: Readonly<{ children: ReactNode; Icon: LucideIcon; label: string }>) {
  return (
    <div className="rounded-2xl border border-ui-border bg-ui-surface-muted p-3">
      <Text variant="caption" className="mb-1 inline-flex items-center gap-2">
        <Icon aria-hidden="true" size={15} />
        {label}
      </Text>
      <div className="text-sm font-bold text-ui-text">{children}</div>
    </div>
  )
}

function getPlanActions({ onDelete, onEdit, onMarkAsCompleted, onMarkAsPaid, plan }: Pick<PatientTreatmentPlanCardProps, 'onDelete' | 'onEdit' | 'onMarkAsCompleted' | 'onMarkAsPaid' | 'plan'>): MenuButtonOption[] {
  const isCompleted = plan.status === 'COMPLETED'

  return [
    {
      disabled: !onEdit || isCompleted,
      Icon: Pencil,
      label: 'Editar plan',
      onSelect: onEdit ? () => onEdit(plan) : undefined,
    },
    {
      disabled: !onMarkAsPaid || plan.isPaid === true,
      Icon: WalletCards,
      label: 'Marcar como pagado',
      onSelect: onMarkAsPaid ? () => onMarkAsPaid(plan) : undefined,
    },
    {
      disabled: !onMarkAsCompleted || isCompleted,
      Icon: CheckCircle2,
      label: 'Marcar como finalizado',
      onSelect: onMarkAsCompleted ? () => onMarkAsCompleted(plan) : undefined,
    },
    {
      disabled: !onDelete,
      Icon: Trash2,
      label: 'Eliminar plan',
      onSelect: onDelete ? () => onDelete(plan) : undefined,
      tone: 'danger',
    },
  ]
}

function formatPlanDate(date: string | null) {
  if (!date) return 'Sin fecha'

  const planDate = new Date(date)
  if (Number.isNaN(planDate.getTime())) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(planDate)
}

function PlanHeader({ actions, plan }: Readonly<{ actions: MenuButtonOption[]; plan: PatientTreatmentPlan }>) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-200 dark:ring-1 dark:ring-primary-300/25">
          <Sparkles aria-hidden="true" size={20} />
        </div>
        <div className="min-w-0">
          <Text as="h3" variant="label" className="truncate text-base">{plan.serviceName}</Text>
          <Text variant="caption">Sesión {plan.completedSessions} de {plan.totalSessions}</Text>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <PlanStatusPill plan={plan} />
        <MenuButton
          aria-label={`Acciones del plan ${plan.serviceName}`}
          Icon={MoreVertical}
          iconOnly
          options={actions}
          panelOffset="tight"
          panelPlacement="bottom-end"
          size="md"
          triggerSize="sm"
          variant="ghost"
        />
      </div>
    </div>
  )
}

function ExtendedPlanContent({ plan, progressPercent }: Readonly<{ plan: PatientTreatmentPlan; progressPercent: number }>) {
  return (
    <>
      <TreatmentChips plan={plan} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PlanDetailItem Icon={CalendarDays} label="Creado">
          {formatPlanDate(plan.createdAt)}
        </PlanDetailItem>
        <PlanDetailItem Icon={CalendarDays} label="Inicio">
          {formatPlanDate(plan.startDate)}
        </PlanDetailItem>
        <PlanDetailItem Icon={Clock} label="Frecuencia">
          {plan.frequency ? FREQUENCY_LABEL[plan.frequency] : 'Sin frecuencia'}
        </PlanDetailItem>
        {plan.professional ? (
          <PlanDetailItem Icon={UserRound} label="Profesional">
            {plan.professional.name}
          </PlanDetailItem>
        ) : null}
        <PlanDetailItem Icon={ReceiptText} label="Costo total">
          {plan.totalCost !== null ? `$${formatCostInput(plan.totalCost)}` : 'Sin costo'}
        </PlanDetailItem>
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

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ui-border bg-ui-surface-muted p-3">
        <div className="inline-flex items-center gap-2 text-sm font-bold text-ui-text-muted">
          {plan.isPaid === true ? <CheckCircle2 aria-hidden="true" className="text-emerald-700 dark:text-emerald-300" size={16} /> : null}
          {plan.isPaid === false ? <XCircle aria-hidden="true" className="text-red-700 dark:text-red-300" size={16} /> : null}
          {plan.isPaid === null ? <ReceiptText aria-hidden="true" size={16} /> : null}
          Estado de pago
        </div>
        <PaymentStatusPill isPaid={plan.isPaid} />
      </div>

      {plan.notes ? (
        <div className="rounded-2xl border border-ui-border bg-ui-surface-muted p-3 text-sm text-ui-text-muted">
          <span className="mb-1 inline-flex items-center gap-2 font-bold text-ui-text"><FileText aria-hidden="true" size={16} />Notas</span>
          <p>{plan.notes}</p>
        </div>
      ) : null}
    </>
  )
}

function PatientTreatmentPlanCard({ onDelete, onEdit, onMarkAsCompleted, onMarkAsPaid, onSelect, plan, variant = 'compact' }: Readonly<PatientTreatmentPlanCardProps>) {
  const progressPercent = getProgressPercent(plan)
  const actions = getPlanActions({ onDelete, onEdit, onMarkAsCompleted, onMarkAsPaid, plan })
  const collapsedContentId = useId()
  const [isCollapsedExpanded, setIsCollapsedExpanded] = useState(false)

  if (variant === 'collapsed') {
    return (
      <article className="rounded-3xl border border-ui-border bg-ui-surface p-4 shadow-[var(--theme-shadow-surface)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <button
              aria-controls={collapsedContentId}
              aria-expanded={isCollapsedExpanded}
              className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
              onClick={() => setIsCollapsedExpanded((currentValue) => !currentValue)}
              type="button"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200 dark:ring-1 dark:ring-slate-300/25">
                <CheckCircle2 aria-hidden="true" size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <Text as="span" variant="label" className="block truncate">{plan.serviceName}</Text>
                <Text as="span" variant="caption" className="block">Finalizado · {formatPlanDate(plan.createdAt)}</Text>
              </span>
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl text-ui-text-muted transition-colors hover:bg-ui-surface-hover hover:text-ui-primary-text">
                <ChevronDown aria-hidden="true" className={isCollapsedExpanded ? 'rotate-180 transition-transform' : 'transition-transform'} size={18} />
              </span>
            </button>
            <PlanStatusPill className="hidden sm:inline-flex" plan={plan} />
          </div>

          {isCollapsedExpanded ? (
            <div className="border-t border-ui-border pt-4" id={collapsedContentId}>
              <div className="flex flex-col gap-4">
                <PlanHeader actions={actions} plan={plan} />
                <ExtendedPlanContent plan={plan} progressPercent={progressPercent} />
              </div>
            </div>
          ) : null}
        </div>
      </article>
    )
  }

  if (variant === 'extended') {
    return (
      <article className="rounded-3xl border border-ui-border bg-ui-surface p-5 shadow-[var(--theme-shadow-surface)]">
        <div className="flex flex-col gap-4">
          <PlanHeader actions={actions} plan={plan} />
          <ExtendedPlanContent plan={plan} progressPercent={progressPercent} />
        </div>
      </article>
    )
  }

  const content = (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-200 dark:ring-1 dark:ring-primary-300/25">
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
