import { apiClient } from '@shared/api'
import type { PatientCreatePayload, PatientDetail, PatientListParams, PatientListResult, PatientSummary, PatientTreatmentPlan, PatientTreatmentPlanCreatePayload, PatientUpdatePayload } from '../model/patient.types'
import type { PatientCreateResponseDto, PatientDetailResponseDto, PatientListResponseDto, PatientTreatmentPlanCreateResponseDto } from './patients.mapper'
import { mapPatientCreatePayloadToDto, mapPatientDtoToDetail, mapPatientDtoToSummary, mapPatientListResponseDto, mapPatientTreatmentPlanCreatePayloadToDto, mapPatientTreatmentPlanDtoToPlan, mapPatientTreatmentPlansResponseDto, mapPatientUpdatePayloadToDto } from './patients.mapper'

const PATIENTS_ENDPOINT = '/v1/patient'

interface GetPatientsParams extends PatientListParams {
  token: string
}

interface CreatePatientParams {
  patient: PatientCreatePayload
  token: string
}

interface GetPatientDetailParams {
  patientId: string
  token: string
}

type GetPatientTreatmentPlansParams = GetPatientDetailParams

interface CreatePatientTreatmentPlanParams {
  patientId: string
  plan: PatientTreatmentPlanCreatePayload
  token: string
}

interface UpdatePatientParams {
  patient: PatientUpdatePayload
  patientId: string
  token: string
}

interface DeletePatientParams {
  patientId: string
  token: string
}

interface DeletePatientResponseDto {
  ok: boolean
  message?: string
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function getPatients({ isActive, limit, offset, searchTerm, sortDirection, sortField, token }: GetPatientsParams): Promise<PatientListResult> {
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })

  if (typeof isActive === 'boolean') {
    query.set('isActive', String(isActive))
  }

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

export async function getPatientDetail({ patientId, token }: GetPatientDetailParams): Promise<PatientDetail> {
  const response = await apiClient.get<PatientDetailResponseDto>(`${PATIENTS_ENDPOINT}/${patientId}`, {
    headers: authHeaders(token),
  })

  return mapPatientDtoToDetail(response.patient)
}

export async function getPatientTreatmentPlans({ patientId, token }: GetPatientTreatmentPlansParams): Promise<PatientTreatmentPlan[]> {
  const query = new URLSearchParams({
    field: 'id',
    filter: patientId,
    includeInactive: 'true',
    limit: '1',
  })

  const response = await apiClient.get<PatientListResponseDto>(`${PATIENTS_ENDPOINT}?${query.toString()}`, {
    headers: authHeaders(token),
  })

  return mapPatientTreatmentPlansResponseDto(response)
}

export async function createPatientTreatmentPlan({ patientId, plan, token }: CreatePatientTreatmentPlanParams): Promise<PatientTreatmentPlan> {
  const response = await apiClient.post<PatientTreatmentPlanCreateResponseDto>(`${PATIENTS_ENDPOINT}/${patientId}/treatment-plan`, {
    body: mapPatientTreatmentPlanCreatePayloadToDto(plan),
    headers: authHeaders(token),
  })

  return mapPatientTreatmentPlanDtoToPlan(response.treatmentPlan)
}

export async function createPatient({ patient, token }: CreatePatientParams): Promise<PatientSummary> {
  const response = await apiClient.post<PatientCreateResponseDto>(PATIENTS_ENDPOINT, {
    body: mapPatientCreatePayloadToDto(patient),
    headers: authHeaders(token),
  })

  return mapPatientDtoToSummary(response.patient)
}

export async function updatePatient({ patient, patientId, token }: UpdatePatientParams): Promise<PatientDetail> {
  const response = await apiClient.put<PatientCreateResponseDto>(PATIENTS_ENDPOINT, {
    body: {
      patientId,
      ...mapPatientUpdatePayloadToDto(patient),
    },
    headers: authHeaders(token),
  })

  return mapPatientDtoToDetail(response.patient)
}

export async function deletePatient({ patientId, token }: DeletePatientParams): Promise<void> {
  const response = await apiClient.delete<DeletePatientResponseDto>(PATIENTS_ENDPOINT, {
    body: { force: true, patientId },
    headers: authHeaders(token),
  })

  if (!response.ok) {
    throw new Error(response.message || 'No se pudo eliminar el paciente')
  }
}
