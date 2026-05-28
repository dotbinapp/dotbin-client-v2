import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteService } from '../api/services.api'
import type { ServiceListResult } from '../model'
import { serviceQueryKeys } from './services.queryKeys'

interface UseServiceDeleteMutationParams {
  centerId?: string
  getAccessToken: () => Promise<string>
}

function removeServiceFromList(currentList: ServiceListResult | undefined, serviceId: string) {
  if (!currentList) return currentList

  return {
    ...currentList,
    services: currentList.services.filter((service) => service.id !== serviceId),
    total: Math.max(currentList.total - 1, 0),
  }
}

export function useServiceDeleteMutation({ centerId, getAccessToken }: UseServiceDeleteMutationParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (serviceId: string) => {
      if (!centerId) throw new Error('No hay un centro activo para eliminar el servicio')

      const token = await getAccessToken()
      await deleteService({ serviceId, token })
      return serviceId
    },
    onSuccess: (serviceId) => {
      if (!centerId) return

      queryClient.setQueriesData<ServiceListResult>({ queryKey: serviceQueryKeys.lists(centerId) }, (currentList) =>
        removeServiceFromList(currentList, serviceId),
      )
      queryClient.invalidateQueries({ queryKey: serviceQueryKeys.lists(centerId) })
    },
  })
}
