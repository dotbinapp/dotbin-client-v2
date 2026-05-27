import { apiClient } from '@shared/api'
import type { PatientListParams, PatientListResult } from '../model/patient.types'
import type { PatientListResponseDto } from './patients.mapper'
import { mapPatientListResponseDto } from './patients.mapper'

const PATIENTS_ENDPOINT = '/v1/patient'

interface GetPatientsParams extends PatientListParams {
  token: string
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function getPatients({ limit, offset, searchTerm, sortDirection, sortField, token }: GetPatientsParams): Promise<PatientListResult> {
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })

  if (searchTerm?.trim()) {
    query.set('filter', searchTerm.trim())
    query.set('field', 'fullName')
  }

  if (sortField) {
    query.set('sortField', sortField)
    query.set('sortType', sortDirection ?? 'asc')
  }

  const response = await apiClient.get<PatientListResponseDto>(`${PATIENTS_ENDPOINT}?${query.toString()}`, {
    headers: authHeaders(token),
  })

  return mapPatientListResponseDto(response)
}
