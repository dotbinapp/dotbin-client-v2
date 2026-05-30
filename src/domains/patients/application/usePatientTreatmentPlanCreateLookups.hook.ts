import { useMemo, useState } from 'react'
import { useProfessionalsQuery } from '@domains/professionals'
import { useServicesQuery } from '@domains/services'
import type { PatientTreatmentPlanLookupOption } from '../model'

interface UsePatientTreatmentPlanCreateLookupsParams {
  centerId?: string
  getAccessToken: () => Promise<string>
  isEnabled: boolean
}

const MIN_LOOKUP_SEARCH_LENGTH = 2
const LOOKUP_PAGE_SIZE = 10

function canSearch(searchTerm: string) {
  return searchTerm.trim().length >= MIN_LOOKUP_SEARCH_LENGTH
}

function mapLookupOption(entity: { id: string; name?: string; fullName?: string }): PatientTreatmentPlanLookupOption {
  return {
    id: entity.id,
    name: entity.name ?? entity.fullName ?? 'Sin nombre',
  }
}

export function usePatientTreatmentPlanCreateLookups({ centerId, getAccessToken, isEnabled }: UsePatientTreatmentPlanCreateLookupsParams) {
  const [serviceSearchTerm, setServiceSearchTerm] = useState('')
  const [professionalSearchTerm, setProfessionalSearchTerm] = useState('')
  const serviceListParams = useMemo(() => ({
    isActive: true,
    limit: LOOKUP_PAGE_SIZE,
    offset: 0,
    searchTerm: serviceSearchTerm,
  }), [serviceSearchTerm])
  const professionalListParams = useMemo(() => ({
    isActive: true,
    limit: LOOKUP_PAGE_SIZE,
    offset: 0,
    searchTerm: professionalSearchTerm,
  }), [professionalSearchTerm])
  const servicesQuery = useServicesQuery({
    centerId,
    enabled: isEnabled && canSearch(serviceSearchTerm),
    getAccessToken,
    params: serviceListParams,
  })
  const professionalsQuery = useProfessionalsQuery({
    centerId,
    enabled: isEnabled && canSearch(professionalSearchTerm),
    getAccessToken,
    params: professionalListParams,
  })

  return {
    minSearchLength: MIN_LOOKUP_SEARCH_LENGTH,
    professionalLookup: {
      isLoading: professionalsQuery.isFetching,
      onSearch: setProfessionalSearchTerm,
      options: professionalsQuery.data?.professionals.map(mapLookupOption) ?? [],
    },
    serviceLookup: {
      isLoading: servicesQuery.isFetching,
      onSearch: setServiceSearchTerm,
      options: servicesQuery.data?.services.map(mapLookupOption) ?? [],
    },
  }
}
