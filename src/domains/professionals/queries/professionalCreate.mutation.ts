import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProfessional } from '../api/professionals.api'
import type { ProfessionalCreatePayload, ProfessionalListParams, ProfessionalListResult, ProfessionalSummary } from '../model'
import { professionalQueryKeys } from './professionals.queryKeys'

interface UseProfessionalCreateMutationParams {
  centerId?: string
  getAccessToken: () => Promise<string>
  listParams: ProfessionalListParams
}

function professionalMatchesListParams(professional: ProfessionalSummary, listParams: ProfessionalListParams) {
  const searchTerm = listParams.searchTerm?.trim().toLowerCase()
  if (!searchTerm) return true

  return professional.fullName.toLowerCase().startsWith(searchTerm)
}

function getProfessionalSortValue(professional: ProfessionalSummary, sortField: ProfessionalListParams['sortField']) {
  if (sortField === 'email') return professional.email ?? ''
  if (sortField === 'specialty') return professional.specialty ?? ''

  return professional.fullName
}

function sortProfessionalsForList(professionals: ProfessionalSummary[], listParams: ProfessionalListParams) {
  if (!listParams.sortField) return professionals

  return [...professionals].sort((firstProfessional, secondProfessional) => {
    const directionMultiplier = listParams.sortDirection === 'desc' ? -1 : 1
    const firstValue = getProfessionalSortValue(firstProfessional, listParams.sortField)
    const secondValue = getProfessionalSortValue(secondProfessional, listParams.sortField)

    return firstValue.localeCompare(secondValue) * directionMultiplier
  })
}

function addCreatedProfessionalToList(currentList: ProfessionalListResult | undefined, createdProfessional: ProfessionalSummary, listParams: ProfessionalListParams) {
  if (!currentList || !professionalMatchesListParams(createdProfessional, listParams)) return currentList

  const professionalExists = currentList.professionals.some((professional) => professional.id === createdProfessional.id)
  if (professionalExists) return currentList

  const nextProfessionals = sortProfessionalsForList([createdProfessional, ...currentList.professionals], listParams).slice(0, listParams.limit)

  return {
    professionals: nextProfessionals,
    total: currentList.total + 1,
  }
}

export function useProfessionalCreateMutation({ centerId, getAccessToken, listParams }: UseProfessionalCreateMutationParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (professionalDraft: ProfessionalCreatePayload) => {
      if (!centerId) throw new Error('No hay un centro activo para crear el profesional')

      const token = await getAccessToken()
      return createProfessional({ centerId, professional: professionalDraft, token })
    },
    onSuccess: (createdProfessional) => {
      if (!centerId) return

      queryClient.setQueryData<ProfessionalListResult>(professionalQueryKeys.list(centerId, listParams), (currentList) =>
        addCreatedProfessionalToList(currentList, createdProfessional, listParams),
      )

      queryClient.invalidateQueries({ queryKey: professionalQueryKeys.lists(centerId) })
    },
  })
}
