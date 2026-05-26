import type { ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, X, XCircle } from 'lucide-react'
import { composeClassName } from '../utils/className.utils'

export type ToastType = 'error' | 'success' | 'warning'

interface ToastContentProps {
  description?: ReactNode
  onDismiss: () => void
  title: ReactNode
  type: ToastType
}

const TOAST_BASE_CLASS =
  'pointer-events-auto flex w-full min-w-80 max-w-md items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-xl shadow-slate-950/10 backdrop-blur-xl'

const TOAST_TYPE_CLASS: Record<ToastType, string> = {
  error: 'border-red-200/80 bg-red-50/90 text-red-950',
  success: 'border-emerald-200/80 bg-emerald-50/90 text-emerald-950',
  warning: 'border-amber-200/80 bg-amber-50/90 text-amber-950',
}

const TOAST_ICON_CLASS: Record<ToastType, string> = {
  error: 'bg-red-100 text-red-600',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
}

const TOAST_ICON_BY_TYPE = {
  error: XCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
}

function ToastContent({ description, onDismiss, title, type }: Readonly<ToastContentProps>) {
  const Icon = TOAST_ICON_BY_TYPE[type]

  return (
    <div className={composeClassName(TOAST_BASE_CLASS, TOAST_TYPE_CLASS[type])}>
      <span className={composeClassName('mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full', TOAST_ICON_CLASS[type])}>
        <Icon aria-hidden="true" size={18} strokeWidth={2.4} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-heading text-sm font-bold leading-5 tracking-tight">{title}</p>
        {description ? <div className="mt-1 text-sm font-medium leading-5 opacity-80">{description}</div> : null}
      </div>

      <button
        aria-label="Cerrar notificación"
        className="-mr-1 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-60 transition hover:bg-white/60 hover:opacity-100"
        onClick={onDismiss}
        type="button"
      >
        <X aria-hidden="true" size={16} />
      </button>
    </div>
  )
}

export default ToastContent
