import type { AppointmentStatus } from '../../model/scheduling.types'

interface CalendarStatusPresentation {
  cardClassName: string
  dotClassName: string
  label: string
  pillActiveClassName: string
  pillInactiveClassName: string
}

const PENDING_PRESENTATION: CalendarStatusPresentation = {
  cardClassName: 'border-status-pending-border bg-status-pending-surface text-status-pending-text',
  dotClassName: 'bg-amber-500',
  label: 'Pendiente',
  pillActiveClassName: 'border-status-pending-border bg-status-pending-surface text-status-pending-text ring-amber-400/40',
  pillInactiveClassName: 'border-status-pending-border bg-status-pending-surface text-status-pending-text hover:brightness-105',
}

export const CALENDAR_STATUS_PRESENTATION: Record<AppointmentStatus, CalendarStatusPresentation> = {
  BLOCKED: {
    cardClassName: 'border-status-blocked-border bg-status-blocked-surface text-status-blocked-text',
    dotClassName: 'bg-slate-500',
    label: 'Bloqueado',
    pillActiveClassName: 'border-status-blocked-border bg-status-blocked-surface text-status-blocked-text ring-slate-400/40',
    pillInactiveClassName: 'border-status-blocked-border bg-status-blocked-surface text-status-blocked-text hover:brightness-105',
  },
  CANCELLED: {
    cardClassName: 'border-status-cancelled-border bg-status-cancelled-surface text-status-cancelled-text',
    dotClassName: 'bg-red-500',
    label: 'Cancelado',
    pillActiveClassName: 'border-status-cancelled-border bg-status-cancelled-surface text-status-cancelled-text ring-red-400/40',
    pillInactiveClassName: 'border-status-cancelled-border bg-status-cancelled-surface text-status-cancelled-text hover:brightness-105',
  },
  COMPLETED: {
    cardClassName: 'border-status-completed-border bg-status-completed-surface text-status-completed-text',
    dotClassName: 'bg-violet-500',
    label: 'Completado',
    pillActiveClassName: 'border-status-completed-border bg-status-completed-surface text-status-completed-text ring-violet-400/40',
    pillInactiveClassName: 'border-status-completed-border bg-status-completed-surface text-status-completed-text hover:brightness-105',
  },
  CONFIRMED: {
    cardClassName: 'border-status-confirmed-border bg-status-confirmed-surface text-status-confirmed-text',
    dotClassName: 'bg-emerald-500',
    label: 'Confirmado',
    pillActiveClassName: 'border-status-confirmed-border bg-status-confirmed-surface text-status-confirmed-text ring-emerald-400/40',
    pillInactiveClassName: 'border-status-confirmed-border bg-status-confirmed-surface text-status-confirmed-text hover:brightness-105',
  },
  DEPOSIT_PENDING: PENDING_PRESENTATION,
  DEPOSIT_RECEIVED: PENDING_PRESENTATION,
  PENDING: PENDING_PRESENTATION,
}

export function getCalendarStatusPresentation(status: AppointmentStatus): CalendarStatusPresentation {
  return CALENDAR_STATUS_PRESENTATION[status]
}
