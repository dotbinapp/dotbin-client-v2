import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateService } from '../api/services.api'
import type { ServiceCreatePayload, ServiceListResult, ServiceSummary } from '../model'
import { serviceQueryKeys } from './services.queryKeys'

interface UseServiceUpdateMutationParams {
  centerId?: string
  getAccessToken: () => Promise<string>
}

interface UpdateServiceMutationPayload {
  serviceDraft: ServiceCreatePayload
  serviceId: string
}

function updateServiceInList(currentList: ServiceListResult | undefined, updatedService: ServiceSummary) {
  if (!currentList) return currentList

  return {
    ...currentList,
    services: currentList.services.map((service) => (service.id === updatedService.id ? updatedService : service)),
  }
}

export function useServiceUpdateMutation({ centerId, getAccessToken }: UseServiceUpdateMutationParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ serviceDraft, serviceId }: UpdateServiceMutationPayload) => {
      if (!centerId) throw new Error('No hay un centro activo para editar el servicio')

      const token = await getAccessToken()
      return updateService({ centerId, service: serviceDraft, serviceId, token })
    },
    onSuccess: (updatedService) => {
      if (!centerId) return

      queryClient.setQueriesData<ServiceListResult>({ queryKey: serviceQueryKeys.lists(centerId) }, (currentList) =>
        updateServiceInList(currentList, updatedService),
      )

      queryClient.invalidateQueries({ queryKey: serviceQueryKeys.lists(centerId) })
    },
  })
}
