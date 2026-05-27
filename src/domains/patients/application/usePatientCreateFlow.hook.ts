import { toast } from '@shared/ui/feedback'
import type { PatientCreatePayload, PatientListParams } from '../model'
import { usePatientCreateMutation } from '../queries/patientCreate.mutation'

interface UsePatientCreateFlowParams {
  centerId?: string
  getAccessToken: () => Promise<string>
  listParams: PatientListParams
  onCreated?: () => void
}

function getCreatePatientErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) return error.message

  return 'Revisá los datos e intentá de nuevo.'
}

export function usePatientCreateFlow({ centerId, getAccessToken, listParams, onCreated }: UsePatientCreateFlowParams) {
  const patientCreateMutation = usePatientCreateMutation({ centerId, getAccessToken, listParams })

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
        description: getCreatePatientErrorMessage(error),
      })
      return false
    }
  }

  return {
    createPatient,
    isCreatingPatient: patientCreateMutation.isPending,
  }
}
