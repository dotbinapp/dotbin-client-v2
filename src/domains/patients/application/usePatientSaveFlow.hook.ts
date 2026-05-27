import { toast } from '@shared/ui/feedback'
import type { PatientCreatePayload, PatientListParams } from '../model'
import { usePatientCreateMutation } from '../queries/patientCreate.mutation'
import { usePatientUpdateMutation } from '../queries/patientUpdate.mutation'

interface UsePatientSaveFlowParams {
  centerId?: string
  getAccessToken: () => Promise<string>
  listParams: PatientListParams
  onCreated?: () => void
}

function getPatientSaveErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) return error.message

  return 'Revisá los datos e intentá de nuevo.'
}

export function usePatientSaveFlow({ centerId, getAccessToken, listParams, onCreated }: UsePatientSaveFlowParams) {
  const patientCreateMutation = usePatientCreateMutation({ centerId, getAccessToken, listParams })
  const patientUpdateMutation = usePatientUpdateMutation({ centerId, getAccessToken })

  const createPatient = async (patientDraft: PatientCreatePayload) => {
    try {
      const createdPatient = await patientCreateMutation.mutateAsync(patientDraft)
      toast.success('Paciente creado', {
        description: `${createdPatient.fullName} creado con éxito.`,
      })
      onCreated?.()
      return true
    } catch (error) {
      toast.error('No se pudo crear el paciente', {
        description: getPatientSaveErrorMessage(error),
      })
      return false
    }
  }

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
    createPatient,
    isCreatingPatient: patientCreateMutation.isPending,
    isSavingPatient: patientCreateMutation.isPending || patientUpdateMutation.isPending,
    isUpdatingPatient: patientUpdateMutation.isPending,
    updatePatient,
  }
}
