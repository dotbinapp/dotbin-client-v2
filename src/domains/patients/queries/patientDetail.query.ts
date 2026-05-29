import { useQuery } from '@tanstack/react-query'
import { getPatientDetail } from '../api/patients.api'
import { patientQueryKeys } from './patients.queryKeys'

interface UsePatientDetailQueryParams {
  canViewPatient: boolean
  centerId?: string
  getAccessToken: () => Promise<string>
  patientId?: string
}

export function usePatientDetailQuery({ canViewPatient, centerId, getAccessToken, patientId }: UsePatientDetailQueryParams) {
  return useQuery({
    enabled: Boolean(canViewPatient && centerId && patientId),
    queryFn: async () => {
      if (!patientId) throw new Error('No hay paciente seleccionado')

      const token = await getAccessToken()
      return getPatientDetail({ patientId, token })
    },
    queryKey: patientQueryKeys.detail(centerId ?? 'no-center', patientId ?? 'no-patient'),
  })
}
