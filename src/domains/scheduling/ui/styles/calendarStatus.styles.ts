import type { AppointmentStatus } from '../../model/scheduling.types'

interface CalendarStatusPresentation {
  cardClassName: string
  dotClassName: string
  label: string
  pillActiveClassName: string
  pillInactiveClassName: string
}

const PENDING_PRESENTATION: CalendarStatusPresentation = {
  cardClassName: 'border-amber-200 bg-amber-100/95 text-amber-800',
  dotClassName: 'bg-amber-500',
  label: 'Pendiente',
  pillActiveClassName: 'border-amber-300 bg-amber-100 text-amber-800 ring-amber-400/40',
  pillInactiveClassName: 'border-amber-200 bg-amber-50/80 text-amber-700 hover:bg-amber-100/90',
}

export const CALENDAR_STATUS_PRESENTATION: Record<AppointmentStatus, CalendarStatusPresentation> = {
  BLOCKED: {
    cardClassName: 'border-slate-300 bg-slate-200/95 text-slate-700',
    dotClassName: 'bg-slate-500',
    label: 'Bloqueado',
    pillActiveClassName: 'border-slate-300 bg-slate-100 text-slate-700 ring-slate-400/40',
    pillInactiveClassName: 'border-slate-200 bg-slate-50/80 text-slate-600 hover:bg-slate-100/90',
  },
  CANCELLED: {
    cardClassName: 'border-red-200 bg-red-100/95 text-red-800',
    dotClassName: 'bg-red-500',
    label: 'Cancelado',
    pillActiveClassName: 'border-red-300 bg-red-100 text-red-800 ring-red-400/40',
    pillInactiveClassName: 'border-red-200 bg-red-50/80 text-red-700 hover:bg-red-100/90',
  },
  COMPLETED: {
    cardClassName: 'border-violet-200 bg-violet-100/95 text-violet-800',
    dotClassName: 'bg-violet-500',
    label: 'Completado',
    pillActiveClassName: 'border-violet-300 bg-violet-100 text-violet-800 ring-violet-400/40',
    pillInactiveClassName: 'border-violet-200 bg-violet-50/80 text-violet-700 hover:bg-violet-100/90',
  },
  CONFIRMED: {
    cardClassName: 'border-emerald-200 bg-emerald-100/95 text-emerald-800',
    dotClassName: 'bg-emerald-500',
    label: 'Confirmado',
    pillActiveClassName: 'border-emerald-300 bg-emerald-100 text-emerald-800 ring-emerald-400/40',
    pillInactiveClassName: 'border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100/90',
  },
  DEPOSIT_PENDING: PENDING_PRESENTATION,
  DEPOSIT_RECEIVED: PENDING_PRESENTATION,
  PENDING: PENDING_PRESENTATION,
}

export function getCalendarStatusPresentation(status: AppointmentStatus): CalendarStatusPresentation {
  return CALENDAR_STATUS_PRESENTATION[status]
}
