import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDays, ClipboardList, DollarSign } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { patientTreatmentPlanCreateSchema } from '@domains/patients/model'
import type { PatientTreatmentPlan, PatientTreatmentPlanCreateFormInputValues, PatientTreatmentPlanCreateFormValues, PatientTreatmentPlanLookupOption } from '@domains/patients/model'
import { ControlledInput, ControlledSelect, ControlledTextArea } from '@shared/ui/molecules'
import TreatmentPlanFormSection from './TreatmentPlanFormSection.component'
import TreatmentPlanPaymentStatusField from './TreatmentPlanPaymentStatusField.component'
import TreatmentPlanProfessionalSearchField from './TreatmentPlanProfessionalSearchField.component'
import TreatmentPlanServiceSearchField from './TreatmentPlanServiceSearchField.component'
import TreatmentPlanSummary from './TreatmentPlanSummary.component'
import { FREQUENCY_LABEL, getTodayInputValue } from './treatmentPlanForm.utils'

interface PatientTreatmentPlanLookupState {
  isLoading: boolean
  onSearch: (searchTerm: string) => void
  options: PatientTreatmentPlanLookupOption[]
}

interface PatientTreatmentPlanCreateFormProps {
  disabled?: boolean
  formId: string
  initialPlan?: PatientTreatmentPlan | null
  isOpen: boolean
  minSearchLength: number
  onMinimumDataChange: (hasMinimumData: boolean) => void
  onValidSubmit?: (planDraft: PatientTreatmentPlanCreateFormValues) => Promise<void> | void
  patientName: string
  professionalLookup: PatientTreatmentPlanLookupState
  serviceLookup: PatientTreatmentPlanLookupState
}

const TREATMENT_PLAN_DEFAULT_VALUES: PatientTreatmentPlanCreateFormInputValues = {
  frequency: 'WEEKLY',
  generateSessions: true,
  notes: '',
  paidAmount: '',
  paymentStatus: 'unpaid',
  professionalId: '',
  startDate: getTodayInputValue(),
  totalCost: '',
  totalSessions: '8',
  treatmentIds: [],
}

function getDateInputValue(dateValue?: string | null) {
  if (!dateValue) return getTodayInputValue()

  return dateValue.split('T')[0]
}

function getPaymentStatus(plan: PatientTreatmentPlan): PatientTreatmentPlanCreateFormInputValues['paymentStatus'] {
  if (plan.isPaid) return 'paid'
  if ((plan.paidAmount ?? 0) > 0) return 'partial'

  return 'unpaid'
}

function getInitialPaidAmountInputValue(initialPlan: PatientTreatmentPlan) {
  if (initialPlan.isPaid) return initialPlan.totalCost === null ? '' : String(initialPlan.totalCost)

  return initialPlan.paidAmount === null ? '' : String(initialPlan.paidAmount)
}

function getInitialFormValues(initialPlan?: PatientTreatmentPlan | null): PatientTreatmentPlanCreateFormInputValues {
  if (!initialPlan) return TREATMENT_PLAN_DEFAULT_VALUES

  return {
    frequency: initialPlan.frequency ?? 'WEEKLY',
    generateSessions: true,
    notes: initialPlan.notes ?? '',
    paidAmount: getInitialPaidAmountInputValue(initialPlan),
    paymentStatus: getPaymentStatus(initialPlan),
    professionalId: initialPlan.professional?.id ?? '',
    startDate: getDateInputValue(initialPlan.startDate),
    totalCost: initialPlan.totalCost === null ? '' : String(initialPlan.totalCost),
    totalSessions: String(initialPlan.totalSessions),
    treatmentIds: initialPlan.treatments.length ? initialPlan.treatments.map((treatment) => treatment.id) : [initialPlan.serviceId],
  }
}

function getInitialSelectedServices(initialPlan?: PatientTreatmentPlan | null): PatientTreatmentPlanLookupOption[] {
  if (!initialPlan) return []

  return initialPlan.treatments.length ? initialPlan.treatments : [{ id: initialPlan.serviceId, name: initialPlan.serviceName }]
}

function PatientTreatmentPlanCreateForm({
  disabled = false,
  formId,
  initialPlan,
  isOpen,
  minSearchLength,
  onMinimumDataChange,
  onValidSubmit,
  patientName,
  professionalLookup,
  serviceLookup,
}: Readonly<PatientTreatmentPlanCreateFormProps>) {
  const [selectedServices, setSelectedServices] = useState<PatientTreatmentPlanLookupOption[]>(() => getInitialSelectedServices(initialPlan))
  const [selectedProfessional, setSelectedProfessional] = useState<PatientTreatmentPlanLookupOption | null>(() => initialPlan?.professional ?? null)
  const { clearErrors, control, formState: { errors }, handleSubmit, reset, setValue } = useForm<PatientTreatmentPlanCreateFormInputValues, unknown, PatientTreatmentPlanCreateFormValues>({
    defaultValues: getInitialFormValues(initialPlan),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(patientTreatmentPlanCreateSchema),
  })
  const treatmentIds = useWatch({ control, name: 'treatmentIds' })
  const totalSessions = useWatch({ control, name: 'totalSessions' })
  const frequency = useWatch({ control, name: 'frequency' })
  const startDate = useWatch({ control, name: 'startDate' })
  const totalCost = useWatch({ control, name: 'totalCost' })
  const paidAmount = useWatch({ control, name: 'paidAmount' })
  const paymentStatus = useWatch({ control, name: 'paymentStatus' })
  const paidAmountDisabled = disabled || paymentStatus === 'unpaid' || paymentStatus === 'paid'

  useEffect(() => {
    if (!isOpen) return

    reset(getInitialFormValues(initialPlan))
  }, [initialPlan, isOpen, reset])

  useEffect(() => {
    onMinimumDataChange(Boolean(treatmentIds?.length && totalSessions && startDate && totalCost))
  }, [onMinimumDataChange, startDate, totalCost, totalSessions, treatmentIds?.length])

  useEffect(() => {
    if (!isOpen || paymentStatus !== 'paid') return

    setValue('paidAmount', totalCost || '', { shouldDirty: true, shouldValidate: false })
    clearErrors('paidAmount')
  }, [clearErrors, isOpen, paymentStatus, setValue, totalCost])

  useEffect(() => {
    if (!isOpen) onMinimumDataChange(false)
  }, [isOpen, onMinimumDataChange])

  const selectService = (service: PatientTreatmentPlanLookupOption) => {
    if (treatmentIds.includes(service.id)) return

    const nextServices = [...selectedServices, service]
    setSelectedServices(nextServices)
    setValue('treatmentIds', nextServices.map((selectedService) => selectedService.id), { shouldDirty: true, shouldValidate: true })
  }

  const removeService = (serviceId: string) => {
    const nextServices = selectedServices.filter((service) => service.id !== serviceId)
    setSelectedServices(nextServices)
    setValue('treatmentIds', nextServices.map((selectedService) => selectedService.id), { shouldDirty: true, shouldValidate: true })
  }

  const selectProfessional = (professional: PatientTreatmentPlanLookupOption) => {
    setSelectedProfessional(professional)
    setValue('professionalId', professional.id, { shouldDirty: true, shouldValidate: true })
  }

  const clearProfessional = () => {
    setSelectedProfessional(null)
    setValue('professionalId', '', { shouldDirty: true, shouldValidate: true })
  }

  const syncPaidAmountWithPaymentStatus = (nextPaymentStatus: PatientTreatmentPlanCreateFormInputValues['paymentStatus']) => {
    if (nextPaymentStatus === 'paid') {
      setValue('paidAmount', totalCost || '', { shouldDirty: true, shouldValidate: false })
      clearErrors('paidAmount')
      return
    }

    if (nextPaymentStatus === 'unpaid') {
      setValue('paidAmount', '', { shouldDirty: true, shouldValidate: false })
      clearErrors('paidAmount')
    }
  }

  const submitPlanDraft: SubmitHandler<PatientTreatmentPlanCreateFormValues> = (planDraft) => {
    onValidSubmit?.(planDraft)
  }

  return (
    <form className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]" id={formId} onSubmit={handleSubmit(submitPlanDraft)}>
      <div className="space-y-4">
        <TreatmentPlanFormSection title="1. Tratamiento">
          <div className="grid gap-3 sm:grid-cols-2">
            <TreatmentPlanServiceSearchField
              disabled={disabled}
              error={errors.treatmentIds?.message}
              isLoading={serviceLookup.isLoading}
              minSearchLength={minSearchLength}
              onRemoveService={removeService}
              onSearch={serviceLookup.onSearch}
              onSelectService={selectService}
              options={serviceLookup.options}
              selectedServices={selectedServices}
            />
            <TreatmentPlanProfessionalSearchField
              disabled={disabled}
              isLoading={professionalLookup.isLoading}
              minSearchLength={minSearchLength}
              onClearProfessional={clearProfessional}
              onSearch={professionalLookup.onSearch}
              onSelectProfessional={selectProfessional}
              options={professionalLookup.options}
              selectedProfessional={selectedProfessional}
            />
          </div>
        </TreatmentPlanFormSection>

        <TreatmentPlanFormSection title="2. Planificación">
          <div className="grid gap-3 sm:grid-cols-2">
            <ControlledInput Icon={ClipboardList} control={control} disabled={disabled} inputMode="numeric" label="Cantidad de sesiones" min={1} name="totalSessions" required size="compact" step={1} type="number" />
            <ControlledSelect control={control} disabled={disabled} label="Frecuencia" name="frequency" required size="compact">
              {Object.entries(FREQUENCY_LABEL).map(([frequencyValue, label]) => (
                <option key={frequencyValue} value={frequencyValue}>{label}</option>
              ))}
            </ControlledSelect>
          </div>

          <ControlledInput Icon={CalendarDays} control={control} disabled={disabled} label="Fecha de inicio" name="startDate" required size="compact" type="date" />
        </TreatmentPlanFormSection>

        <TreatmentPlanFormSection title="3. Costos y pago">
          <div className="grid gap-3 sm:grid-cols-2">
            <ControlledInput Icon={DollarSign} control={control} disabled={disabled} format="cost" label="Costo total" name="totalCost" placeholder="Ej: 180.000,00" required size="compact" />
            <TreatmentPlanPaymentStatusField control={control} disabled={disabled} onStatusChange={syncPaidAmountWithPaymentStatus} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ControlledInput Icon={DollarSign} control={control} disabled={paidAmountDisabled} format="cost" label="Monto abonado" name="paidAmount" placeholder="Ej: 60.000,00" required={paymentStatus === 'partial'} size="compact" />
          </div>
        </TreatmentPlanFormSection>

        <TreatmentPlanFormSection title="4. Notas">
          <ControlledTextArea control={control} disabled={disabled} label="Observaciones internas" name="notes" placeholder="Agregar observaciones internas del plan" size="compact" />
        </TreatmentPlanFormSection>
      </div>

      <TreatmentPlanSummary
        patientName={patientName}
        professionalName={selectedProfessional?.name}
        treatmentName={selectedServices.map((service) => service.name).join(', ')}
        values={{ frequency, paidAmount, paymentStatus, startDate, totalCost, totalSessions }}
      />
    </form>
  )
}

export default PatientTreatmentPlanCreateForm
