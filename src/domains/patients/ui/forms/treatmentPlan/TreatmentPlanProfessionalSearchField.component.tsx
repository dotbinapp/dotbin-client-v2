import { useId } from 'react'
import type { PatientTreatmentPlanLookupOption } from '@domains/patients/model'
import { Text } from '@shared/ui/atoms'
import { SearchMenu, SelectedPillList } from '@shared/ui/molecules'

interface TreatmentPlanProfessionalSearchFieldProps {
  disabled?: boolean
  isLoading?: boolean
  minSearchLength: number
  onClearProfessional: () => void
  onSearch: (searchTerm: string) => void
  onSelectProfessional: (professional: PatientTreatmentPlanLookupOption) => void
  options: PatientTreatmentPlanLookupOption[]
  selectedProfessional?: PatientTreatmentPlanLookupOption | null
}

function TreatmentPlanProfessionalSearchField({
  disabled = false,
  isLoading = false,
  minSearchLength,
  onClearProfessional,
  onSearch,
  onSelectProfessional,
  options,
  selectedProfessional,
}: Readonly<TreatmentPlanProfessionalSearchFieldProps>) {
  const searchInputId = useId()

  return (
    <div className="flex flex-col gap-2.5">
      <Text as="label" className="block" htmlFor={searchInputId} variant="label">Profesional asignado</Text>
      <SearchMenu
        ariaLabel="Buscar profesionales"
        disabled={disabled}
        emptyMessage="No encontramos profesionales con esa búsqueda."
        getItemKey={(professional) => professional.id}
        getItemLabel={(professional) => professional.name}
        inputId={searchInputId}
        items={options}
        loading={isLoading}
        minSearchLength={minSearchLength}
        onSearch={onSearch}
        onSelect={onSelectProfessional}
        placeholder="Buscar profesional"
        searchPrompt={`Opcional. Escribí al menos ${minSearchLength} caracteres para buscar.`}
      />

      <SelectedPillList
        ariaLabel="Profesional seleccionado"
        disabled={disabled}
        getItemKey={(professional) => professional.id}
        getItemLabel={(professional) => professional.name}
        getRemoveAriaLabel={(professional) => `Quitar ${professional.name}`}
        items={selectedProfessional ? [selectedProfessional] : []}
        onRemove={onClearProfessional}
      />
    </div>
  )
}

export default TreatmentPlanProfessionalSearchField
