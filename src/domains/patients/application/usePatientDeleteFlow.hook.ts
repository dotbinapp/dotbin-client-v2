import { toast } from '@shared/ui/feedback'
import type { PatientSummary } from '../model'
import { usePatientDeleteMutation } from '../queries/patientDelete.mutation'

interface UsePatientDeleteFlowParams {
  centerId?: string
  getAccessToken: () => Promise<string>
}

function getPatientDeleteErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) return error.message

  return 'Intentá nuevamente en unos segundos.'
}

export function usePatientDeleteFlow({ centerId, getAccessToken }: UsePatientDeleteFlowParams) {
  const patientDeleteMutation = usePatientDeleteMutation({ centerId, getAccessToken })

  const deletePatient = async (patient: PatientSummary) => {
    try {
      await patientDeleteMutation.mutateAsync(patient.id)
      toast.success('Paciente eliminado', {
        description: `${patient.fullName} fue desactivado correctamente.`,
      })
      return true
    } catch (error) {
      toast.error('No se pudo eliminar el paciente', {
        description: getPatientDeleteErrorMessage(error),
      })
      return false
    }
  }

  return {
    deletePatient,
    isDeletingPatient: patientDeleteMutation.isPending,
  }
}
