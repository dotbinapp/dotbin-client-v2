import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Stethoscope, UserRound } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { professionalCreateSchema } from '@domains/professionals/model'
import type { ProfessionalCreateFormInputValues, ProfessionalCreateFormValues } from '@domains/professionals/model'
import { themeClass } from '@shared/styles/theme.styles'
import { ControlledInput, ControlledPhoneInput } from '@shared/ui/molecules'

interface ProfessionalCreateFormProps {
  disabled?: boolean
  formId: string
  initialValues?: ProfessionalCreateFormInputValues
  isOpen: boolean
  onMinimumDataChange: (hasMinimumData: boolean) => void
  onValidSubmit?: (professionalDraft: ProfessionalCreateFormValues) => Promise<void> | void
}

const PROFESSIONAL_CREATE_DEFAULT_VALUES: ProfessionalCreateFormInputValues = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  specialty: '',
}

function ProfessionalCreateForm({
  disabled = false,
  formId,
  initialValues,
  isOpen,
  onMinimumDataChange,
  onValidSubmit,
}: Readonly<ProfessionalCreateFormProps>) {
  const { control, handleSubmit, reset } = useForm<ProfessionalCreateFormInputValues, unknown, ProfessionalCreateFormValues>({
    defaultValues: PROFESSIONAL_CREATE_DEFAULT_VALUES,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(professionalCreateSchema),
  })
  const firstName = useWatch({ control, name: 'firstName' })
  const lastName = useWatch({ control, name: 'lastName' })

  useEffect(() => {
    if (!isOpen) return

    reset(initialValues ?? PROFESSIONAL_CREATE_DEFAULT_VALUES)
  }, [initialValues, isOpen, reset])

  useEffect(() => {
    onMinimumDataChange(Boolean(firstName.trim() && lastName.trim()))
  }, [firstName, lastName, onMinimumDataChange])

  useEffect(() => {
    if (!isOpen) onMinimumDataChange(false)
  }, [isOpen, onMinimumDataChange])

  const submitProfessionalDraft: SubmitHandler<ProfessionalCreateFormValues> = (professionalDraft) => {
    onValidSubmit?.(professionalDraft)
  }

  return (
    <form className="space-y-5" id={formId} onSubmit={handleSubmit(submitProfessionalDraft)}>
      <fieldset className="space-y-3">
        <legend className={`w-full border-b pb-2 text-xs font-bold uppercase tracking-[0.18em] ${themeClass.border.default} ${themeClass.text.muted}`}>Datos mínimos</legend>

        <div className="grid gap-3 sm:grid-cols-2">
          <ControlledInput Icon={UserRound} autoComplete="given-name" control={control} disabled={disabled} label="Nombre" name="firstName" required size="compact" />
          <ControlledInput Icon={UserRound} autoComplete="family-name" control={control} disabled={disabled} label="Apellido" name="lastName" required size="compact" />
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className={`w-full border-b pb-2 text-xs font-bold uppercase tracking-[0.18em] ${themeClass.border.default} ${themeClass.text.muted}`}>Datos adicionales</legend>

        <div className="grid gap-3 sm:grid-cols-2">
          <ControlledInput Icon={Mail} autoComplete="email" control={control} disabled={disabled} inputMode="email" label="Email" name="email" size="compact" type="email" />
          <ControlledPhoneInput control={control} disabled={disabled} label="Teléfono" name="phone" />
        </div>

        <ControlledInput Icon={Stethoscope} control={control} disabled={disabled} label="Especialidad" name="specialty" placeholder="Ej: Dermatología" size="compact" />
      </fieldset>
    </form>
  )
}

export default ProfessionalCreateForm
