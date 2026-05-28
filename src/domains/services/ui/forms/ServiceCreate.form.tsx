import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Clock, DollarSign, FileText, Sparkles } from 'lucide-react'
import { useController, useForm, useWatch } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { serviceCreateSchema } from '@domains/services/model'
import type { ServiceCreateFormInputValues, ServiceCreateFormValues } from '@domains/services/model'
import { themeClass } from '@shared/styles/theme.styles'
import { ControlledInput, ControlledTextArea, ToggleFieldPanel } from '@shared/ui/molecules'

interface ServiceCreateFormProps {
  disabled?: boolean
  formId: string
  initialValues?: ServiceCreateFormInputValues
  isOpen: boolean
  onMinimumDataChange: (hasMinimumData: boolean) => void
  onValidSubmit?: (serviceDraft: ServiceCreateFormValues) => Promise<void> | void
}

const SERVICE_CREATE_DEFAULT_VALUES: ServiceCreateFormInputValues = {
  cost: '',
  depositAmount: '',
  description: '',
  durationMinutes: '',
  hasPostServiceInstructions: false,
  name: '',
  postServiceInstructions: '',
  requiresDeposit: false,
}

function ServiceCreateForm({ disabled = false, formId, initialValues, isOpen, onMinimumDataChange, onValidSubmit }: Readonly<ServiceCreateFormProps>) {
  const { clearErrors, control, handleSubmit, reset, setValue } = useForm<ServiceCreateFormInputValues, unknown, ServiceCreateFormValues>({
    defaultValues: SERVICE_CREATE_DEFAULT_VALUES,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(serviceCreateSchema),
  })
  const serviceName = useWatch({ control, name: 'name' })
  const serviceCost = useWatch({ control, name: 'cost' })
  const serviceDuration = useWatch({ control, name: 'durationMinutes' })
  const {
    field: {
      onBlur: onRequiresDepositBlur,
      onChange: onRequiresDepositChange,
      value: requiresDepositValue,
    },
  } = useController<ServiceCreateFormInputValues, 'requiresDeposit', ServiceCreateFormValues>({ control, name: 'requiresDeposit' })
  const {
    field: {
      onBlur: onPostServiceInstructionsBlur,
      onChange: onPostServiceInstructionsChange,
      value: hasPostServiceInstructionsValue,
    },
  } = useController<ServiceCreateFormInputValues, 'hasPostServiceInstructions', ServiceCreateFormValues>({ control, name: 'hasPostServiceInstructions' })
  const requiresDeposit = Boolean(requiresDepositValue)
  const hasPostServiceInstructions = Boolean(hasPostServiceInstructionsValue)

  useEffect(() => {
    if (!isOpen) return

    reset(initialValues ?? SERVICE_CREATE_DEFAULT_VALUES)
  }, [initialValues, isOpen, reset])

  useEffect(() => {
    onMinimumDataChange(Boolean(serviceName.trim() && serviceCost.trim() && serviceDuration.trim()))
  }, [serviceCost, serviceDuration, serviceName, onMinimumDataChange])

  useEffect(() => {
    if (!isOpen) onMinimumDataChange(false)
  }, [isOpen, onMinimumDataChange])

  useEffect(() => {
    if (requiresDeposit) return

    setValue('depositAmount', '')
    clearErrors('depositAmount')
  }, [clearErrors, requiresDeposit, setValue])

  useEffect(() => {
    if (hasPostServiceInstructions) return

    setValue('postServiceInstructions', '')
    clearErrors('postServiceInstructions')
  }, [clearErrors, hasPostServiceInstructions, setValue])

  const submitServiceDraft: SubmitHandler<ServiceCreateFormValues> = (serviceDraft) => {
    onValidSubmit?.(serviceDraft)
  }

  return (
    <form className="space-y-5" id={formId} onSubmit={handleSubmit(submitServiceDraft)}>
      <fieldset className="space-y-3">
        <legend className={`w-full border-b pb-2 text-xs font-bold uppercase tracking-[0.18em] ${themeClass.border.default} ${themeClass.text.muted}`}>Datos del servicio</legend>

        <ControlledInput Icon={Sparkles} control={control} disabled={disabled} label="Nombre del servicio" name="name" placeholder="Ej: Limpieza facial profunda" required size="compact" />

        <ControlledInput Icon={FileText} control={control} disabled={disabled} label="Descripción" name="description" placeholder="Ej: Exfoliación, extracción y máscara calmante" size="compact" />

        <div className="grid gap-3 sm:grid-cols-2">
          <ControlledInput Icon={DollarSign} control={control} disabled={disabled} format="cost" label="Costo (ARS)" name="cost" placeholder="Ej: 28.000,00" required size="compact" />
          <ControlledInput Icon={Clock} control={control} disabled={disabled} inputMode="numeric" label="Duración (min)" min={1} name="durationMinutes" placeholder="Ej: 60" required size="compact" step={1} type="number" />
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className={`w-full border-b pb-2 text-xs font-bold uppercase tracking-[0.18em] ${themeClass.border.default} ${themeClass.text.muted}`}>Configuración avanzada</legend>

        <ToggleFieldPanel
          checked={requiresDeposit}
          description="Habilita monto de seña para reservar el servicio."
          disabled={disabled}
          onCheckedChange={(nextChecked) => {
            onRequiresDepositChange(nextChecked)
            onRequiresDepositBlur()
          }}
          title="Requiere seña"
        >
          <ControlledInput Icon={DollarSign} control={control} disabled={disabled || !requiresDeposit} format="cost" label="Valor de la seña (ARS)" name="depositAmount" placeholder="Ej: 10.000,00" required={requiresDeposit} size="compact" />
        </ToggleFieldPanel>

        <ToggleFieldPanel
          checked={hasPostServiceInstructions}
          description="Habilita indicaciones visibles para el post-servicio."
          disabled={disabled}
          onCheckedChange={(nextChecked) => {
            onPostServiceInstructionsChange(nextChecked)
            onPostServiceInstructionsBlur()
          }}
          title="Indicaciones post-servicio"
        >
          <ControlledTextArea
            control={control}
            disabled={disabled || !hasPostServiceInstructions}
            label="Indicaciones post-servicio"
            name="postServiceInstructions"
            placeholder="Ej: Evitar maquillaje por 24 horas. Usar protector solar factor 50+."
            required={hasPostServiceInstructions}
            size="compact"
          />
        </ToggleFieldPanel>
      </fieldset>
    </form>
  )
}

export default ServiceCreateForm
