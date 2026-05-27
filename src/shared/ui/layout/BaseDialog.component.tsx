import type { ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from '../atoms'
import { Toast } from '../atoms'
import { themeClass } from '../../styles/theme.styles'
import { composeClassName } from '../utils/className.utils'

type BaseDialogSize = 'sm' | 'md' | 'lg' | 'xl'

interface BaseDialogProps {
  children: ReactNode
  className?: string
  description?: ReactNode
  footer?: ReactNode
  isOpen: boolean
  onClose: () => void
  size?: BaseDialogSize
  title: ReactNode
}

const DIALOG_SIZE_CLASS: Record<BaseDialogSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

const CLOSED_BY_LIGHT_DISMISS = { closedby: 'any' as const }

function isBackdropClick(dialog: HTMLDialogElement, event: MouseEvent) {
  if (event.target !== dialog) return false

  const dialogBounds = dialog.getBoundingClientRect()

  return (
    event.clientY < dialogBounds.top ||
    event.clientY > dialogBounds.bottom ||
    event.clientX < dialogBounds.left ||
    event.clientX > dialogBounds.right
  )
}

function BaseDialog({
  children,
  className = '',
  description,
  footer,
  isOpen,
  onClose,
  size = 'md',
  title,
}: Readonly<BaseDialogProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
      return
    }

    if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => onClose()
    const handleCancel = (event: Event) => {
      event.preventDefault()
      onClose()
    }
    const handleClick = (event: MouseEvent) => {
      if (isBackdropClick(dialog, event)) onClose()
    }

    dialog.addEventListener('close', handleClose)
    dialog.addEventListener('cancel', handleCancel)
    dialog.addEventListener('click', handleClick)

    return () => {
      dialog.removeEventListener('close', handleClose)
      dialog.removeEventListener('cancel', handleCancel)
      dialog.removeEventListener('click', handleClick)
    }
  }, [onClose])

  return (
    <dialog
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      className={composeClassName(
        `m-auto max-h-[90vh] w-[min(92vw,100%)] overflow-hidden rounded-3xl p-0 backdrop:bg-slate-950/45 backdrop:backdrop-blur-sm ${themeClass.surface.elevated} ${themeClass.text.default}`,
        DIALOG_SIZE_CLASS[size],
        className,
      )}
      ref={dialogRef}
      {...CLOSED_BY_LIGHT_DISMISS}
    >
      <div className="flex max-h-[90vh] flex-col">
        <header className={`shrink-0 border-b bg-ui-surface-muted/90 px-6 py-5 ${themeClass.border.default}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <h2 className={`font-heading text-xl font-bold tracking-tight ${themeClass.text.default}`} id={titleId}>
                {title}
              </h2>

              {description ? (
                <p className={`max-w-2xl text-sm leading-6 ${themeClass.text.muted}`} id={descriptionId}>
                  {description}
                </p>
              ) : null}
            </div>

            <Button aria-label="Cerrar diálogo" iconOnly Icon={X} onClick={onClose} size="sm" variant="ghost" />
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer ? <footer className={`shrink-0 border-t bg-ui-surface-muted px-6 py-4 ${themeClass.border.default}`}>{footer}</footer> : null}
      </div>
      <Toast />
    </dialog>
  )
}

export default BaseDialog
