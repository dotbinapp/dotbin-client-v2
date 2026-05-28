import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createService } from '../api/services.api'
import type { ServiceCreatePayload, ServiceListParams, ServiceListResult, ServiceSummary } from '../model'
import { serviceQueryKeys } from './services.queryKeys'

interface UseServiceCreateMutationParams {
  centerId?: string
  getAccessToken: () => Promise<string>
  listParams: ServiceListParams
}

function serviceMatchesListParams(service: ServiceSummary, listParams: ServiceListParams) {
  const searchTerm = listParams.searchTerm?.trim().toLowerCase()
  if (!searchTerm) return true

  return service.name.toLowerCase().startsWith(searchTerm)
}

function getServiceSortValue(service: ServiceSummary, sortField: ServiceListParams['sortField']) {
  if (sortField === 'description') return service.description ?? ''
  if (sortField === 'durationMinutes') return service.durationMinutes
  if (sortField === 'price') return service.cost

  return service.name
}

function sortServicesForList(services: ServiceSummary[], listParams: ServiceListParams) {
  if (!listParams.sortField) return services

  return [...services].sort((firstService, secondService) => {
    const directionMultiplier = listParams.sortDirection === 'desc' ? -1 : 1
    const firstValue = getServiceSortValue(firstService, listParams.sortField)
    const secondValue = getServiceSortValue(secondService, listParams.sortField)

    if (typeof firstValue === 'number' && typeof secondValue === 'number') {
      return (firstValue - secondValue) * directionMultiplier
    }

    return String(firstValue).localeCompare(String(secondValue)) * directionMultiplier
  })
}

function addCreatedServiceToList(currentList: ServiceListResult | undefined, createdService: ServiceSummary, listParams: ServiceListParams) {
  if (!currentList || !serviceMatchesListParams(createdService, listParams)) return currentList

  const serviceExists = currentList.services.some((service) => service.id === createdService.id)
  if (serviceExists) return currentList

  const nextServices = sortServicesForList([createdService, ...currentList.services], listParams).slice(0, listParams.limit)

  return {
    services: nextServices,
    total: currentList.total + 1,
  }
}

export function useServiceCreateMutation({ centerId, getAccessToken, listParams }: UseServiceCreateMutationParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (serviceDraft: ServiceCreatePayload) => {
      if (!centerId) throw new Error('No hay un centro activo para crear el servicio')

      const token = await getAccessToken()
      return createService({ centerId, service: serviceDraft, token })
    },
    onSuccess: (createdService) => {
      if (!centerId) return

      queryClient.setQueryData<ServiceListResult>(serviceQueryKeys.list(centerId, listParams), (currentList) =>
        addCreatedServiceToList(currentList, createdService, listParams),
      )

      queryClient.invalidateQueries({ queryKey: serviceQueryKeys.lists(centerId) })
    },
  })
}
