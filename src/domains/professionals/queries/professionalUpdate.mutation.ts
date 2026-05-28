import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfessional } from '../api/professionals.api'
import type { ProfessionalCreatePayload, ProfessionalListResult, ProfessionalSummary } from '../model'
import { professionalQueryKeys } from './professionals.queryKeys'

interface UseProfessionalUpdateMutationParams {
  centerId?: string
  getAccessToken: () => Promise<string>
}

interface UpdateProfessionalMutationPayload {
  professionalDraft: ProfessionalCreatePayload
  professionalId: string
}

function updateProfessionalInList(currentList: ProfessionalListResult | undefined, updatedProfessional: ProfessionalSummary) {
  if (!currentList) return currentList

  return {
    ...currentList,
    professionals: currentList.professionals.map((professional) => (professional.id === updatedProfessional.id ? updatedProfessional : professional)),
  }
}

export function useProfessionalUpdateMutation({ centerId, getAccessToken }: UseProfessionalUpdateMutationParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ professionalDraft, professionalId }: UpdateProfessionalMutationPayload) => {
      if (!centerId) throw new Error('No hay un centro activo para editar el profesional')

      const token = await getAccessToken()
      return updateProfessional({ centerId, professional: professionalDraft, professionalId, token })
    },
    onSuccess: (updatedProfessional) => {
      if (!centerId) return

      queryClient.setQueriesData<ProfessionalListResult>({ queryKey: professionalQueryKeys.lists(centerId) }, (currentList) =>
        updateProfessionalInList(currentList, updatedProfessional),
      )

      queryClient.invalidateQueries({ queryKey: professionalQueryKeys.lists(centerId) })
    },
  })
}
