import { useQuery } from '@tanstack/react-query'
import { getPatientTreatmentPlans } from '../api/patients.api'
import { patientQueryKeys } from './patients.queryKeys'

interface UsePatientTreatmentPlansQueryParams {
  canViewPatient: boolean
  centerId?: string
  getAccessToken: () => Promise<string>
  patientId?: string
}

export function usePatientTreatmentPlansQuery({ canViewPatient, centerId, getAccessToken, patientId }: UsePatientTreatmentPlansQueryParams) {
  return useQuery({
    enabled: Boolean(canViewPatient && centerId && patientId),
    queryFn: async () => {
      if (!patientId) throw new Error('No hay paciente seleccionado')

      const token = await getAccessToken()
      return getPatientTreatmentPlans({ patientId, token })
    },
    queryKey: patientQueryKeys.treatmentPlans(centerId ?? 'no-center', patientId ?? 'no-patient'),
  })
}
