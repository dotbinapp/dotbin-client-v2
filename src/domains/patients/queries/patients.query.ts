import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getPatients } from '../api/patients.api'
import type { PatientListParams } from '../model/patient.types'
import { patientQueryKeys } from './patients.queryKeys'

interface UsePatientsQueryParams {
  centerId?: string
  getAccessToken: () => Promise<string>
  params: PatientListParams
}

export function usePatientsQuery({ centerId, getAccessToken, params }: UsePatientsQueryParams) {
  return useQuery({
    enabled: Boolean(centerId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const token = await getAccessToken()
      return getPatients({ ...params, token })
    },
    queryKey: patientQueryKeys.list(centerId ?? 'no-center', params),
  })
}
