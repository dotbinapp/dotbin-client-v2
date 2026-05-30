import { useId } from 'react'
import type { PatientTreatmentPlanLookupOption } from '@domains/patients/model'
import { Text } from '@shared/ui/atoms'
import { SearchMenu, SelectedPillList } from '@shared/ui/molecules'

interface TreatmentPlanServiceSearchFieldProps {
  disabled?: boolean
  error?: string
  isLoading?: boolean
  minSearchLength: number
  onRemoveService: (serviceId: string) => void
  onSearch: (searchTerm: string) => void
  onSelectService: (service: PatientTreatmentPlanLookupOption) => void
  options: PatientTreatmentPlanLookupOption[]
  selectedServices: PatientTreatmentPlanLookupOption[]
}

function TreatmentPlanServiceSearchField({
  disabled = false,
  error,
  isLoading = false,
  minSearchLength,
  onRemoveService,
  onSearch,
  onSelectService,
  options,
  selectedServices,
}: Readonly<TreatmentPlanServiceSearchFieldProps>) {
  const searchInputId = useId()
  const selectedServiceIds = new Set(selectedServices.map((service) => service.id))
  const availableOptions = options.filter((service) => !selectedServiceIds.has(service.id))

  return (
    <div className="flex flex-col gap-2.5">
      <Text as="label" className="block" htmlFor={searchInputId} variant="label">
        Tratamientos <span className="text-primary-600">*</span>
      </Text>
      <SearchMenu
        ariaLabel="Buscar tratamientos"
        disabled={disabled}
        emptyMessage="No encontramos tratamientos con esa búsqueda."
        getItemKey={(service) => service.id}
        getItemLabel={(service) => service.name}
        inputId={searchInputId}
        items={availableOptions}
        loading={isLoading}
        minSearchLength={minSearchLength}
        onSearch={onSearch}
        onSelect={onSelectService}
        placeholder="Buscar tratamiento"
        searchPrompt={`Escribí al menos ${minSearchLength} caracteres para buscar.`}
      />

      <SelectedPillList
        ariaLabel="Tratamientos seleccionados"
        disabled={disabled}
        getItemKey={(service) => service.id}
        getItemLabel={(service) => service.name}
        getRemoveAriaLabel={(service) => `Quitar ${service.name}`}
        items={selectedServices}
        onRemove={(service) => onRemoveService(service.id)}
      />

      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
    </div>
  )
}

export default TreatmentPlanServiceSearchField
