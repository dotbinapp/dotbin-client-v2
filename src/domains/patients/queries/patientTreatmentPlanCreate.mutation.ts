import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPatientTreatmentPlan } from '../api/patients.api'
import type { PatientTreatmentPlanCreatePayload } from '../model'
import { patientQueryKeys } from './patients.queryKeys'

interface UsePatientTreatmentPlanCreateMutationParams {
  centerId?: string
  getAccessToken: () => Promise<string>
  patientId?: string
}

export function usePatientTreatmentPlanCreateMutation({ centerId, getAccessToken, patientId }: UsePatientTreatmentPlanCreateMutationParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (planDraft: PatientTreatmentPlanCreatePayload) => {
      if (!centerId) throw new Error('No hay un centro activo para crear el plan')
      if (!patientId) throw new Error('No hay un paciente seleccionado para crear el plan')

      const token = await getAccessToken()
      return createPatientTreatmentPlan({ patientId, plan: planDraft, token })
    },
    onSuccess: () => {
      if (!centerId || !patientId) return

      queryClient.invalidateQueries({ queryKey: patientQueryKeys.treatmentPlans(centerId, patientId) })
      queryClient.invalidateQueries({ queryKey: patientQueryKeys.detail(centerId, patientId) })
      queryClient.invalidateQueries({ queryKey: patientQueryKeys.lists(centerId) })
    },
  })
}
