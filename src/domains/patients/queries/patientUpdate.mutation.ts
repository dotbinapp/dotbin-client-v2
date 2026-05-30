import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePatient } from '../api/patients.api'
import type { PatientDetail, PatientListResult, PatientSummary, PatientUpdatePayload } from '../model'
import { patientQueryKeys } from './patients.queryKeys'

interface UsePatientUpdateMutationParams {
  centerId?: string
  getAccessToken: () => Promise<string>
}

interface UpdatePatientMutationPayload {
  patientDraft: PatientUpdatePayload
  patientId: string
}

function updatePatientInList(currentList: PatientListResult | undefined, updatedPatient: PatientSummary) {
  if (!currentList) return currentList

  return {
    ...currentList,
    patients: currentList.patients.map((patient) => (patient.id === updatedPatient.id ? updatedPatient : patient)),
  }
}

export function usePatientUpdateMutation({ centerId, getAccessToken }: UsePatientUpdateMutationParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ patientDraft, patientId }: UpdatePatientMutationPayload) => {
      if (!centerId) throw new Error('No hay un centro activo para editar el paciente')

      const token = await getAccessToken()
      return updatePatient({ patient: patientDraft, patientId, token })
    },
    onSuccess: (updatedPatient, { patientDraft, patientId }) => {
      if (!centerId) return

      queryClient.setQueriesData<PatientListResult>({ queryKey: patientQueryKeys.lists(centerId) }, (currentList) =>
        updatePatientInList(currentList, updatedPatient),
      )

      queryClient.setQueryData<PatientDetail>(patientQueryKeys.detail(centerId, patientId), (currentPatient) => {
        if (!currentPatient) return currentPatient

        return {
          ...currentPatient,
          ...updatedPatient,
          patientMedicalInfo: patientDraft.patientMedicalInfo ?? currentPatient.patientMedicalInfo,
        }
      })

      queryClient.invalidateQueries({ queryKey: patientQueryKeys.lists(centerId) })
    },
  })
}
