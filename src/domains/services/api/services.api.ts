import { apiClient } from '@shared/api'
import type { ServiceCreatePayload, ServiceListParams, ServiceListResult, ServiceSummary } from '../model'
import type { ServiceCreateResponseDto, ServiceListResponseDto } from './services.mapper'
import { mapServiceCreatePayloadToDto, mapServiceDtoToSummary, mapServiceListResponseDto, mapServiceUpdatePayloadToDto } from './services.mapper'

const SERVICES_ENDPOINT = '/v1/treatment'

interface GetServicesParams extends ServiceListParams {
  token: string
}

interface CreateServiceParams {
  centerId: string
  service: ServiceCreatePayload
  token: string
}

interface UpdateServiceParams extends CreateServiceParams {
  serviceId: string
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function getServices({ limit, offset, searchTerm, sortDirection, sortField, token }: GetServicesParams): Promise<ServiceListResult> {
  const query = new URLSearchParams({
    limit: String(limit),
    skip: String(offset),
  })

  if (searchTerm?.trim()) {
    query.set('filter', searchTerm.trim())
    query.set('field', 'name')
  }

  if (sortField) {
    query.set('sortField', sortField)
    query.set('sortType', sortDirection ?? 'asc')
  }

  const response = await apiClient.get<ServiceListResponseDto>(`${SERVICES_ENDPOINT}?${query.toString()}`, {
    headers: authHeaders(token),
  })

  return mapServiceListResponseDto(response)
}

export async function createService({ centerId, service, token }: CreateServiceParams): Promise<ServiceSummary> {
  const response = await apiClient.post<ServiceCreateResponseDto>(SERVICES_ENDPOINT, {
    body: mapServiceCreatePayloadToDto(centerId, service),
    headers: authHeaders(token),
  })

  return mapServiceDtoToSummary(response.treatment)
}

export async function updateService({ centerId, service, serviceId, token }: UpdateServiceParams): Promise<ServiceSummary> {
  const response = await apiClient.put<ServiceCreateResponseDto>(SERVICES_ENDPOINT, {
    body: mapServiceUpdatePayloadToDto(centerId, serviceId, service),
    headers: authHeaders(token),
  })

  return mapServiceDtoToSummary(response.treatment)
}
