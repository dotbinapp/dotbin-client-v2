import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getServices } from '../api/services.api'
import type { ServiceListParams } from '../model'
import { serviceQueryKeys } from './services.queryKeys'

interface UseServicesQueryParams {
  centerId?: string
  enabled?: boolean
  getAccessToken: () => Promise<string>
  params: ServiceListParams
}

export function useServicesQuery({ centerId, enabled = true, getAccessToken, params }: UseServicesQueryParams) {
  return useQuery({
    enabled: Boolean(enabled && centerId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const token = await getAccessToken()
      return getServices({ ...params, token })
    },
    queryKey: serviceQueryKeys.list(centerId ?? 'no-center', params),
  })
}
