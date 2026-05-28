import type { ProfessionalListParams } from '../model/professional.types'

export const professionalQueryKeys = {
  all: ['professionals'] as const,
  list: (centerId: string, params: ProfessionalListParams) => [...professionalQueryKeys.all, 'list', centerId, params] as const,
  lists: (centerId: string) => [...professionalQueryKeys.all, 'list', centerId] as const,
}
