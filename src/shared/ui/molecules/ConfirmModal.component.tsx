import { useEffect, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import Button from '../atoms/Button.component'
import Text from '../atoms/Text.component'
import BaseContainer from '../layout/BaseContainer.component'

type ConfirmModalPrimaryAction = 'confirm' | 'danger'

interface ConfirmModalProps {
  description: string
  Icon: LucideIcon
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
  primaryAction?: ConfirmModalPrimaryAction
  title: string
}

function ConfirmModal({
  description,
  Icon,
  loading = false,
  onClose,
  onConfirm,
  primaryAction = 'confirm',
  title,
}: Readonly<ConfirmModalProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const confirmButtonVariant = primaryAction === 'danger' ? 'danger' : 'primary'

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog?.open) {
      dialog?.showModal()
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirm-modal-title"
      className="m-auto max-w-md bg-transparent p-0 backdrop:bg-slate-950/35 backdrop:backdrop-blur-sm"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <BaseContainer className="text-center" padding="lg" surface="solid">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <Icon aria-hidden="true" size={32} />
        </div>
        <Text id="confirm-modal-title" as="h2" variant="title">
          {title}
        </Text>
        <Text className="mb-6 mt-2" tone="muted">
          {description}
        </Text>
        <div className="flex gap-3">
          <Button disabled={loading} fullWidth onClick={onClose} variant="ghost">
            Cancelar
          </Button>
          <Button fullWidth loading={loading} onClick={onConfirm} variant={confirmButtonVariant}>
            Confirmar
          </Button>
        </div>
      </BaseContainer>
    </dialog>
  )
}

export default ConfirmModal
