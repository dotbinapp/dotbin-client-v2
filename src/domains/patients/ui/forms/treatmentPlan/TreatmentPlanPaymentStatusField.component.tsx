import type { Control } from 'react-hook-form'
import { useController } from 'react-hook-form'
import type { PatientTreatmentPlanCreateFormInputValues, PatientTreatmentPlanCreateFormValues, PatientTreatmentPlanPaymentStatus } from '@domains/patients/model'
import { PAYMENT_STATUS_LABEL } from './treatmentPlanForm.utils'

interface TreatmentPlanPaymentStatusFieldProps {
  control: Control<PatientTreatmentPlanCreateFormInputValues, unknown, PatientTreatmentPlanCreateFormValues>
  disabled?: boolean
  onStatusChange?: (status: PatientTreatmentPlanPaymentStatus) => void
}

const PAYMENT_STATUS_OPTIONS: PatientTreatmentPlanPaymentStatus[] = ['unpaid', 'partial', 'paid']

function TreatmentPlanPaymentStatusField({ control, disabled = false, onStatusChange }: Readonly<TreatmentPlanPaymentStatusFieldProps>) {
  const {
    field: { name, onBlur, onChange, value },
  } = useController<PatientTreatmentPlanCreateFormInputValues, 'paymentStatus', PatientTreatmentPlanCreateFormValues>({ control, name: 'paymentStatus' })

  return (
    <fieldset className="space-y-1.5">
      <legend className="text-sm font-bold text-ui-text">Estado de pago</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {PAYMENT_STATUS_OPTIONS.map((status) => {
          const isSelected = value === status

          return (
            <label
              className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-3 text-sm font-bold transition-colors ${isSelected ? 'border-primary-400 bg-primary-600 text-white shadow-lg shadow-primary-900/20 dark:border-primary-300/60 dark:bg-primary-500 dark:text-white' : 'border-ui-border-strong bg-ui-surface text-ui-text-muted hover:border-primary-200 hover:text-ui-text dark:hover:border-primary-300/45'} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
              key={status}
            >
              <input
                checked={isSelected}
                className="sr-only"
                disabled={disabled}
                name={name}
                onBlur={onBlur}
                onChange={() => {
                  onChange(status)
                  onStatusChange?.(status)
                }}
                type="radio"
                value={status}
              />
              {PAYMENT_STATUS_LABEL[status]}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default TreatmentPlanPaymentStatusField
