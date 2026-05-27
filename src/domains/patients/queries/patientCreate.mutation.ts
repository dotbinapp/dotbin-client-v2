import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPatient } from '../api/patients.api'
import type { PatientCreatePayload, PatientListParams, PatientListResult, PatientSummary } from '../model'
import { patientQueryKeys } from './patients.queryKeys'

interface UsePatientCreateMutationParams {
  centerId?: string
  getAccessToken: () => Promise<string>
  listParams: PatientListParams
}

function patientMatchesListParams(patient: PatientSummary, listParams: PatientListParams) {
  const searchTerm = listParams.searchTerm?.trim().toLowerCase()
  if (!searchTerm) return true

  return patient.fullName.toLowerCase().startsWith(searchTerm)
}

function sortPatientsForList(patients: PatientSummary[], listParams: PatientListParams) {
  if (listParams.sortField !== 'fullName') return patients

  return [...patients].sort((firstPatient, secondPatient) => {
    const directionMultiplier = listParams.sortDirection === 'desc' ? -1 : 1
    return firstPatient.fullName.localeCompare(secondPatient.fullName) * directionMultiplier
  })
}

function addCreatedPatientToList(currentList: PatientListResult | undefined, createdPatient: PatientSummary, listParams: PatientListParams) {
  if (!currentList || !patientMatchesListParams(createdPatient, listParams)) return currentList

  const patientExists = currentList.patients.some((patient) => patient.id === createdPatient.id)
  if (patientExists) return currentList

  const nextPatients = sortPatientsForList([createdPatient, ...currentList.patients], listParams).slice(0, listParams.limit)

  return {
    patients: nextPatients,
    total: currentList.total + 1,
  }
}

export function usePatientCreateMutation({ centerId, getAccessToken, listParams }: UsePatientCreateMutationParams) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (patientDraft: PatientCreatePayload) => {
      if (!centerId) throw new Error('No hay un centro activo para crear el paciente')

      const token = await getAccessToken()
      return createPatient({ patient: patientDraft, token })
    },
    onSuccess: (createdPatient) => {
      if (!centerId) return

      queryClient.setQueryData<PatientListResult>(patientQueryKeys.list(centerId, listParams), (currentList) =>
        addCreatedPatientToList(currentList, createdPatient, listParams),
      )

      queryClient.invalidateQueries({ queryKey: patientQueryKeys.lists(centerId) })
    },
  })
}
