import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePatient } from '../api/patients.api'
import type { PatientListResult } from '../model'
import { patientQueryKeys } from './patients.queryKeys'

interface UsePatientDeleteMutationParams {
  centerId?: string
  getAccessToken: () => Promise<string>
}

function removePatientFromList(currentList: PatientListResult | undefined, patientId: string) {
  if (!currentList) return currentList

  return {
    ...currentList,
    patients: currentList.patients.filter((patient) => patient.id !== patientId),
    total: Math.max(currentList.total - 1, 0),
  }
}

export function usePatientDeleteMutation({ centerId, getAccessToken }: UsePatientDeleteMutationParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (patientId: string) => {
      if (!centerId) throw new Error('No hay un centro activo para eliminar el paciente')

      const token = await getAccessToken()
      await deletePatient({ patientId, token })
      return patientId
    },
    onSuccess: (patientId) => {
      if (!centerId) return

      queryClient.setQueriesData<PatientListResult>({ queryKey: patientQueryKeys.lists(centerId) }, (currentList) =>
        removePatientFromList(currentList, patientId),
      )
      queryClient.invalidateQueries({ queryKey: patientQueryKeys.lists(centerId) })
    },
  })
}
