import { toast } from '@shared/ui/feedback'
import type { ServiceSummary } from '../model'
import { useServiceDeleteMutation } from '../queries/serviceDelete.mutation'

interface UseServiceDeleteFlowParams {
  centerId?: string
  getAccessToken: () => Promise<string>
}

function getServiceDeleteErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) return error.message

  return 'Intentá nuevamente en unos segundos.'
}

export function useServiceDeleteFlow({ centerId, getAccessToken }: UseServiceDeleteFlowParams) {
  const serviceDeleteMutation = useServiceDeleteMutation({ centerId, getAccessToken })

  const deleteService = async (service: ServiceSummary) => {
    try {
      await serviceDeleteMutation.mutateAsync(service.id)
      toast.success('Servicio eliminado', {
        description: `${service.name} fue desactivado correctamente.`,
      })
      return true
    } catch (error) {
      toast.error('No se pudo eliminar el servicio', {
        description: getServiceDeleteErrorMessage(error),
      })
      return false
    }
  }

  return {
    deleteService,
    isDeletingService: serviceDeleteMutation.isPending,
  }
}
