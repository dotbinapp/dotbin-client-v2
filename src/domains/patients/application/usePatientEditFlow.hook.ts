import { toast } from '@shared/ui/feedback'
import type { PatientCreatePayload } from '../model'
import { usePatientUpdateMutation } from '../queries/patientUpdate.mutation'
import { getPatientSaveErrorMessage } from './usePatientSaveFlow.hook'

interface UsePatientEditFlowParams {
  centerId?: string
  getAccessToken: () => Promise<string>
}

export function usePatientEditFlow({ centerId, getAccessToken }: UsePatientEditFlowParams) {
  const patientUpdateMutation = usePatientUpdateMutation({ centerId, getAccessToken })

  const updatePatient = async (patientId: string, patientDraft: PatientCreatePayload) => {
    try {
      const updatedPatient = await patientUpdateMutation.mutateAsync({ patientDraft, patientId })
      toast.success('Paciente actualizado', {
        description: `${updatedPatient.fullName} actualizado con éxito.`,
      })
      return true
    } catch (error) {
      toast.error('No se pudo editar el paciente', {
        description: getPatientSaveErrorMessage(error),
      })
      return false
    }
  }

  return {
    isUpdatingPatient: patientUpdateMutation.isPending,
    updatePatient,
  }
}
