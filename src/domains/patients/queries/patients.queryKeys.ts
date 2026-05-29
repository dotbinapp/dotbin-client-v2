import type { PatientListParams } from '../model/patient.types'

export const patientQueryKeys = {
  all: ['patients'] as const,
  detail: (centerId: string, patientId: string) => [...patientQueryKeys.all, 'detail', centerId, patientId] as const,
  lists: (centerId: string) => [...patientQueryKeys.all, 'list', centerId] as const,
  list: (centerId: string, params: PatientListParams) => [...patientQueryKeys.all, 'list', centerId, params] as const,
  treatmentPlans: (centerId: string, patientId: string) => [...patientQueryKeys.all, 'treatment-plans', centerId, patientId] as const,
}
