import { toast } from '@shared/ui/feedback'
import type { ProfessionalCreatePayload, ProfessionalListParams } from '../model'
import { useProfessionalCreateMutation } from '../queries/professionalCreate.mutation'
import { useProfessionalUpdateMutation } from '../queries/professionalUpdate.mutation'

interface UseProfessionalSaveFlowParams {
  centerId?: string
  getAccessToken: () => Promise<string>
  listParams: ProfessionalListParams
  onCreated?: () => void
}

function getProfessionalSaveErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) return error.message

  return 'Revisá los datos e intentá de nuevo.'
}

export function useProfessionalSaveFlow({ centerId, getAccessToken, listParams, onCreated }: UseProfessionalSaveFlowParams) {
  const professionalCreateMutation = useProfessionalCreateMutation({ centerId, getAccessToken, listParams })
  const professionalUpdateMutation = useProfessionalUpdateMutation({ centerId, getAccessToken })

  const createProfessional = async (professionalDraft: ProfessionalCreatePayload) => {
    try {
      const createdProfessional = await professionalCreateMutation.mutateAsync(professionalDraft)
      toast.success('Profesional creado', {
        description: `${createdProfessional.fullName} creado con éxito.`,
      })
      onCreated?.()
      return true
    } catch (error) {
      toast.error('No se pudo crear el profesional', {
        description: getProfessionalSaveErrorMessage(error),
      })
      return false
    }
  }

  const updateProfessional = async (professionalId: string, professionalDraft: ProfessionalCreatePayload) => {
    try {
      const updatedProfessional = await professionalUpdateMutation.mutateAsync({ professionalDraft, professionalId })
      toast.success('Profesional actualizado', {
        description: `${updatedProfessional.fullName} actualizado con éxito.`,
      })
      return true
    } catch (error) {
      toast.error('No se pudo editar el profesional', {
        description: getProfessionalSaveErrorMessage(error),
      })
      return false
    }
  }

  return {
    createProfessional,
    isCreatingProfessional: professionalCreateMutation.isPending,
    isSavingProfessional: professionalCreateMutation.isPending || professionalUpdateMutation.isPending,
    isUpdatingProfessional: professionalUpdateMutation.isPending,
    updateProfessional,
  }
}
