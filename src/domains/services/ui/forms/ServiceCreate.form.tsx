import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Clock, DollarSign, FileText, Sparkles } from 'lucide-react'
import { useController, useForm, useWatch } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { serviceCreateSchema } from '@domains/services/model'
import type { ServiceCreateFormInputValues, ServiceCreateFormValues } from '@domains/services/model'
import { themeClass } from '@shared/styles/theme.styles'
import { ControlledInput, ControlledTextArea } from '@shared/ui/molecules'

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
  const { control, handleSubmit, reset, setValue } = useForm<ServiceCreateFormInputValues, unknown, ServiceCreateFormValues>({
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
      name: requiresDepositFieldName,
      onBlur: onRequiresDepositBlur,
      onChange: onRequiresDepositChange,
      ref: requiresDepositRef,
      value: requiresDepositValue,
    },
  } = useController<ServiceCreateFormInputValues, 'requiresDeposit', ServiceCreateFormValues>({ control, name: 'requiresDeposit' })
  const {
    field: {
      name: postServiceInstructionsFieldName,
      onBlur: onPostServiceInstructionsBlur,
      onChange: onPostServiceInstructionsChange,
      ref: postServiceInstructionsRef,
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
    if (!requiresDeposit) setValue('depositAmount', '')
  }, [requiresDeposit, setValue])

  useEffect(() => {
    if (!hasPostServiceInstructions) setValue('postServiceInstructions', '')
  }, [hasPostServiceInstructions, setValue])

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

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-2 text-sm font-medium text-ui-text-muted">
            <input
              checked={requiresDeposit}
              className="mt-1 size-4 accent-primary-600"
              disabled={disabled}
              name={requiresDepositFieldName}
              onBlur={onRequiresDepositBlur}
              onChange={(event) => onRequiresDepositChange(event.target.checked)}
              ref={requiresDepositRef}
              type="checkbox"
            />
            <span>
              <span className="block font-bold text-ui-text-default">Requiere seña</span>
              <span className="block text-xs text-ui-text-muted">Habilita monto de seña para reservar el servicio.</span>
            </span>
          </label>

          <ControlledInput Icon={DollarSign} control={control} disabled={disabled || !requiresDeposit} format="cost" label="Valor de la seña (ARS)" name="depositAmount" placeholder="Ej: 10.000,00" required={requiresDeposit} size="compact" />
        </div>

        <label className="flex cursor-pointer items-start gap-2 text-sm font-medium text-ui-text-muted">
          <input
            checked={hasPostServiceInstructions}
            className="mt-1 size-4 accent-primary-600"
            disabled={disabled}
            name={postServiceInstructionsFieldName}
            onBlur={onPostServiceInstructionsBlur}
            onChange={(event) => onPostServiceInstructionsChange(event.target.checked)}
            ref={postServiceInstructionsRef}
            type="checkbox"
          />
          <span>
            <span className="block font-bold text-ui-text-default">Indicaciones post-servicio</span>
            <span className="block text-xs text-ui-text-muted">Habilita indicaciones visibles para el post-servicio.</span>
          </span>
        </label>

        <ControlledTextArea
          control={control}
          disabled={disabled || !hasPostServiceInstructions}
          label="Indicaciones post-servicio"
          name="postServiceInstructions"
          placeholder="Ej: Evitar maquillaje por 24 horas. Usar protector solar factor 50+."
          required={hasPostServiceInstructions}
          size="compact"
        />
      </fieldset>
    </form>
  )
}

export default ServiceCreateForm
