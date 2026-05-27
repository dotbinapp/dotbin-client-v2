import type { PatientListParams } from '../model/patient.types'

export const patientQueryKeys = {
  all: ['patients'] as const,
  lists: (centerId: string) => [...patientQueryKeys.all, 'list', centerId] as const,
  list: (centerId: string, params: PatientListParams) => [...patientQueryKeys.all, 'list', centerId, params] as const,
}
