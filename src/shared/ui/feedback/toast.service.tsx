import type { ReactNode } from 'react'
import { toast as sonnerToast } from 'sonner'
import type { ExternalToast } from 'sonner'
import ToastContent from './ToastContent.component'
import type { ToastType } from './ToastContent.component'

interface AppToastOptions extends Omit<ExternalToast, 'description' | 'icon'> {
  description?: ReactNode
}

const TOAST_TITLE_BY_TYPE: Record<ToastType, string> = {
  error: 'Error',
  success: 'Éxito',
  warning: 'Atención',
}

function showToast(type: ToastType, title: ReactNode = TOAST_TITLE_BY_TYPE[type], options: AppToastOptions = {}) {
  const { description, duration = type === 'error' ? 6000 : 4200, ...sonnerOptions } = options

  return sonnerToast.custom(
    (toastId) => (
      <ToastContent description={description} onDismiss={() => sonnerToast.dismiss(toastId)} title={title} type={type} />
    ),
    {
      duration,
      ...sonnerOptions,
    },
  )
}

export const toast = {
  dismiss: sonnerToast.dismiss,
  error: (title?: ReactNode, options?: AppToastOptions) => showToast('error', title, options),
  success: (title?: ReactNode, options?: AppToastOptions) => showToast('success', title, options),
  warning: (title?: ReactNode, options?: AppToastOptions) => showToast('warning', title, options),
}
