import { apiClient } from '@shared/api'
import type { ProfessionalCreatePayload, ProfessionalListParams, ProfessionalListResult, ProfessionalSummary } from '../model/professional.types'
import type { ProfessionalCreateResponseDto, ProfessionalListResponseDto } from './professionals.mapper'
import { mapProfessionalCreatePayloadToDto, mapProfessionalDtoToSummary, mapProfessionalListResponseDto } from './professionals.mapper'

const PROFESSIONALS_ENDPOINT = '/v1/doctor'

interface GetProfessionalsParams extends ProfessionalListParams {
  token: string
}

interface CreateProfessionalParams {
  centerId: string
  professional: ProfessionalCreatePayload
  token: string
}

interface UpdateProfessionalParams extends CreateProfessionalParams {
  professionalId: string
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function getProfessionals({ limit, offset, searchTerm, sortDirection, sortField, token }: GetProfessionalsParams): Promise<ProfessionalListResult> {
  const query = new URLSearchParams({
    limit: String(limit),
    skip: String(offset),
  })

  if (searchTerm?.trim()) {
    query.set('filter', searchTerm.trim())
    query.set('field', 'fullName')
  }

  if (sortField) {
    query.set('sortField', sortField)
    query.set('sortType', sortDirection ?? 'asc')
  }

  const response = await apiClient.get<ProfessionalListResponseDto>(`${PROFESSIONALS_ENDPOINT}?${query.toString()}`, {
    headers: authHeaders(token),
  })

  return mapProfessionalListResponseDto(response)
}

export async function createProfessional({ centerId, professional, token }: CreateProfessionalParams): Promise<ProfessionalSummary> {
  const response = await apiClient.post<ProfessionalCreateResponseDto>(PROFESSIONALS_ENDPOINT, {
    body: {
      ...mapProfessionalCreatePayloadToDto(professional),
      centerId,
    },
    headers: authHeaders(token),
  })

  return mapProfessionalDtoToSummary(response.doctor)
}

export async function updateProfessional({ centerId, professional, professionalId, token }: UpdateProfessionalParams): Promise<ProfessionalSummary> {
  const response = await apiClient.put<ProfessionalCreateResponseDto>(PROFESSIONALS_ENDPOINT, {
    body: {
      professionalId,
      doctorId: professionalId,
      centerId,
      ...mapProfessionalCreatePayloadToDto(professional),
    },
    headers: authHeaders(token),
  })

  return mapProfessionalDtoToSummary(response.doctor)
}
