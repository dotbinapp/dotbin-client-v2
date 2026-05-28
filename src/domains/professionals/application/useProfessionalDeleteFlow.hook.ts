import { toast } from '@shared/ui/feedback'
import type { ProfessionalSummary } from '../model'
import { useProfessionalDeleteMutation } from '../queries/professionalDelete.mutation'

interface UseProfessionalDeleteFlowParams {
  centerId?: string
  getAccessToken: () => Promise<string>
}

function getProfessionalDeleteErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) return error.message

  return 'Intentá nuevamente en unos segundos.'
}

export function useProfessionalDeleteFlow({ centerId, getAccessToken }: UseProfessionalDeleteFlowParams) {
  const professionalDeleteMutation = useProfessionalDeleteMutation({ centerId, getAccessToken })

  const deleteProfessional = async (professional: ProfessionalSummary) => {
    try {
      await professionalDeleteMutation.mutateAsync(professional.id)
      toast.success('Profesional eliminado', {
        description: `${professional.fullName} fue desactivado correctamente.`,
      })
      return true
    } catch (error) {
      toast.error('No se pudo eliminar el profesional', {
        description: getProfessionalDeleteErrorMessage(error),
      })
      return false
    }
  }

  return {
    deleteProfessional,
    isDeletingProfessional: professionalDeleteMutation.isPending,
  }
}
