import type { PatientListParams } from '../model/patient.types'

export const patientQueryKeys = {
  all: ['patients'] as const,
  list: (centerId: string, params: PatientListParams) => [...patientQueryKeys.all, 'list', centerId, params] as const,
}
