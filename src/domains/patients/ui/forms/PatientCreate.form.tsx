import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AtSign, CalendarDays, IdCard, Mail, UserRound } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { patientCreateSchema } from '@domains/patients/model'
import type { PatientCreateFormInputValues, PatientCreateFormValues } from '@domains/patients/model'
import { themeClass } from '@shared/styles/theme.styles'
import { ControlledInput, ControlledPhoneInput, ControlledSelect } from '@shared/ui/molecules'

interface PatientCreateFormProps {
  disabled?: boolean
  formId: string
  initialValues?: PatientCreateFormInputValues
  isOpen: boolean
  onMinimumDataChange: (hasMinimumData: boolean) => void
  onValidSubmit?: (patientDraft: PatientCreateFormValues) => Promise<void> | void
}

const PATIENT_CREATE_DEFAULT_VALUES: PatientCreateFormInputValues = {
  dateOfBirth: '',
  documentNumber: '',
  email: '',
  firstName: '',
  gender: '',
  instagramAccount: '',
  lastName: '',
  phone: '',
}

function PatientCreateForm({ disabled = false, formId, initialValues, isOpen, onMinimumDataChange, onValidSubmit }: Readonly<PatientCreateFormProps>) {
  const { control, handleSubmit, reset } = useForm<PatientCreateFormInputValues, unknown, PatientCreateFormValues>({
    defaultValues: PATIENT_CREATE_DEFAULT_VALUES,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(patientCreateSchema),
  })
  const firstName = useWatch({ control, name: 'firstName' })
  const lastName = useWatch({ control, name: 'lastName' })
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!isOpen) return

    reset(initialValues ?? PATIENT_CREATE_DEFAULT_VALUES)
  }, [initialValues, isOpen, reset])

  useEffect(() => {
    onMinimumDataChange(Boolean(firstName.trim() && lastName.trim()))
  }, [firstName, lastName, onMinimumDataChange])

  useEffect(() => {
    if (!isOpen) onMinimumDataChange(false)
  }, [isOpen, onMinimumDataChange])

  const submitPatientDraft: SubmitHandler<PatientCreateFormValues> = (patientDraft) => {
    onValidSubmit?.(patientDraft)
  }

  return (
    <form className="space-y-5" id={formId} onSubmit={handleSubmit(submitPatientDraft)}>
      <fieldset className="space-y-3">
        <legend className={`w-full border-b pb-2 text-xs font-bold uppercase tracking-[0.18em] ${themeClass.border.default} ${themeClass.text.muted}`}>Datos mínimos</legend>

        <div className="grid gap-3 sm:grid-cols-2">
          <ControlledInput Icon={UserRound} control={control} disabled={disabled} label="Nombre" name="firstName" required size="compact" />
          <ControlledInput Icon={UserRound} control={control} disabled={disabled} label="Apellido" name="lastName" required size="compact" />
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className={`w-full border-b pb-2 text-xs font-bold uppercase tracking-[0.18em] ${themeClass.border.default} ${themeClass.text.muted}`}>Datos adicionales</legend>

        <div className="grid gap-3 sm:grid-cols-2">
          <ControlledSelect control={control} disabled={disabled} label="Género" name="gender" size="compact">
            <option value="">Sin especificar</option>
            <option value="female">Femenino</option>
            <option value="male">Masculino</option>
          </ControlledSelect>

          <ControlledInput Icon={CalendarDays} control={control} disabled={disabled} label="Fecha de nacimiento" max={today} name="dateOfBirth" size="compact" type="date" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ControlledInput Icon={Mail} autoComplete="email" control={control} disabled={disabled} inputMode="email" label="Email" name="email" size="compact" type="email" />
          <ControlledPhoneInput control={control} disabled={disabled} label="Teléfono" name="phone" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ControlledInput Icon={AtSign} control={control} disabled={disabled} label="Instagram" name="instagramAccount" placeholder="usuario_instagram" size="compact" />
          <ControlledInput Icon={IdCard} control={control} disabled={disabled} inputMode="numeric" label="Nro. documento" min={0} name="documentNumber" size="compact" step={1} type="number" />
        </div>
      </fieldset>
    </form>
  )
}

export default PatientCreateForm
