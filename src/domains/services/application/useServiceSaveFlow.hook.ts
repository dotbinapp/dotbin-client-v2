import { toast } from '@shared/ui/feedback'
import type { ServiceCreatePayload, ServiceListParams } from '../model'
import { useServiceCreateMutation } from '../queries/serviceCreate.mutation'
import { useServiceUpdateMutation } from '../queries/serviceUpdate.mutation'

interface UseServiceSaveFlowParams {
  centerId?: string
  getAccessToken: () => Promise<string>
  listParams: ServiceListParams
  onCreated?: () => void
}

function getServiceSaveErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) return error.message

  return 'Revisá los datos e intentá de nuevo.'
}

export function useServiceSaveFlow({ centerId, getAccessToken, listParams, onCreated }: UseServiceSaveFlowParams) {
  const serviceCreateMutation = useServiceCreateMutation({ centerId, getAccessToken, listParams })
  const serviceUpdateMutation = useServiceUpdateMutation({ centerId, getAccessToken })

  const createService = async (serviceDraft: ServiceCreatePayload) => {
    try {
      const createdService = await serviceCreateMutation.mutateAsync(serviceDraft)
      toast.success('Servicio creado', {
        description: `${createdService.name} creado con éxito.`,
      })
      onCreated?.()
      return true
    } catch (error) {
      toast.error('No se pudo crear el servicio', {
        description: getServiceSaveErrorMessage(error),
      })
      return false
    }
  }

  const updateService = async (serviceId: string, serviceDraft: ServiceCreatePayload) => {
    try {
      const updatedService = await serviceUpdateMutation.mutateAsync({ serviceDraft, serviceId })
      toast.success('Servicio actualizado', {
        description: `${updatedService.name} actualizado con éxito.`,
      })
      return true
    } catch (error) {
      toast.error('No se pudo editar el servicio', {
        description: getServiceSaveErrorMessage(error),
      })
      return false
    }
  }

  return {
    createService,
    isCreatingService: serviceCreateMutation.isPending,
    isSavingService: serviceCreateMutation.isPending || serviceUpdateMutation.isPending,
    isUpdatingService: serviceUpdateMutation.isPending,
    updateService,
  }
}
