import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getProfessionals } from '../api/professionals.api'
import type { ProfessionalListParams } from '../model/professional.types'
import { professionalQueryKeys } from './professionals.queryKeys'

interface UseProfessionalsQueryParams {
  centerId?: string
  getAccessToken: () => Promise<string>
  params: ProfessionalListParams
}

export function useProfessionalsQuery({ centerId, getAccessToken, params }: UseProfessionalsQueryParams) {
  return useQuery({
    enabled: Boolean(centerId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const token = await getAccessToken()
      return getProfessionals({ ...params, token })
    },
    queryKey: professionalQueryKeys.list(centerId ?? 'no-center', params),
  })
}
