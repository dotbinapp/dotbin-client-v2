import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProfessional } from '../api/professionals.api'
import type { ProfessionalListResult } from '../model'
import { professionalQueryKeys } from './professionals.queryKeys'

interface UseProfessionalDeleteMutationParams {
  centerId?: string
  getAccessToken: () => Promise<string>
}

function removeProfessionalFromList(currentList: ProfessionalListResult | undefined, professionalId: string) {
  if (!currentList) return currentList

  return {
    ...currentList,
    professionals: currentList.professionals.filter((professional) => professional.id !== professionalId),
    total: Math.max(currentList.total - 1, 0),
  }
}

export function useProfessionalDeleteMutation({ centerId, getAccessToken }: UseProfessionalDeleteMutationParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (professionalId: string) => {
      if (!centerId) throw new Error('No hay un centro activo para eliminar el profesional')

      const token = await getAccessToken()
      await deleteProfessional({ professionalId, token })
      return professionalId
    },
    onSuccess: (professionalId) => {
      if (!centerId) return

      queryClient.setQueriesData<ProfessionalListResult>({ queryKey: professionalQueryKeys.lists(centerId) }, (currentList) =>
        removeProfessionalFromList(currentList, professionalId),
      )
      queryClient.invalidateQueries({ queryKey: professionalQueryKeys.lists(centerId) })
    },
  })
}
