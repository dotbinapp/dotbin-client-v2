import type { ServiceListParams } from '../model'

export const serviceQueryKeys = {
  all: ['services'] as const,
  list: (centerId: string, params: ServiceListParams) => [...serviceQueryKeys.all, 'list', centerId, params] as const,
  lists: (centerId: string) => [...serviceQueryKeys.all, 'list', centerId] as const,
}
