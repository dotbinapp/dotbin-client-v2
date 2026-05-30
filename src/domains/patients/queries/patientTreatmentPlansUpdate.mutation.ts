import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePatient } from '../api/patients.api'
import type { PatientTreatmentPlanUpdatePayload } from '../model'
import { patientQueryKeys } from './patients.queryKeys'

interface UsePatientTreatmentPlansUpdateMutationParams {
  centerId?: string
  getAccessToken: () => Promise<string>
  patientId?: string
}

export function usePatientTreatmentPlansUpdateMutation({ centerId, getAccessToken, patientId }: UsePatientTreatmentPlansUpdateMutationParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (treatmentPlans: PatientTreatmentPlanUpdatePayload[]) => {
      if (!centerId) throw new Error('No hay un centro activo para editar el plan')
      if (!patientId) throw new Error('No hay un paciente seleccionado para editar el plan')

      const token = await getAccessToken()
      return updatePatient({ patient: { treatmentPlans }, patientId, token })
    },
    onSuccess: () => {
      if (!centerId || !patientId) return

      queryClient.invalidateQueries({ queryKey: patientQueryKeys.treatmentPlans(centerId, patientId) })
      queryClient.invalidateQueries({ queryKey: patientQueryKeys.detail(centerId, patientId) })
      queryClient.invalidateQueries({ queryKey: patientQueryKeys.lists(centerId) })
    },
  })
}
