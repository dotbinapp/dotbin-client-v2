import type { PatientCreatePayload, PatientListResult, PatientSummary } from '../model/patient.types'

export interface PatientCreateRequestDto {
  dateOfBirth?: string
  documentNumber?: string
  email?: string
  firstName: string
  gender?: 'female' | 'male'
  instagramAccount?: string
  lastName: string
  phone?: string
}

export interface PatientDto {
  dateOfBirth?: string | null
  documentNumber?: string | null
  email?: string | null
  firstName?: string | null
  fullName?: string | null
  gender?: 'female' | 'male' | null
  id: string
  instagramAccount?: string | null
  isActive?: boolean | null
  lastVisitDate?: string | null
  lastName?: string | null
  phone?: string | null
  visits?: number | null
}

export interface PatientListResponseDto {
  ok: boolean
  patients?: PatientDto[]
  total?: number
}

export interface PatientCreateResponseDto {
  ok: boolean
  patient: PatientDto
}

function getOptionalText(value?: string) {
  const normalizedValue = value?.trim()
  return normalizedValue || undefined
}

function getOptionalNumericText(value?: number) {
  return value === undefined ? undefined : String(value)
}

export function mapPatientCreatePayloadToDto(patient: PatientCreatePayload): PatientCreateRequestDto {
  return {
    dateOfBirth: getOptionalText(patient.dateOfBirth),
    documentNumber: getOptionalNumericText(patient.documentNumber),
    email: getOptionalText(patient.email),
    firstName: patient.firstName.trim(),
    gender: patient.gender || undefined,
    instagramAccount: getOptionalText(patient.instagramAccount),
    lastName: patient.lastName.trim(),
    phone: getOptionalText(patient.phone),
  }
}

export function mapPatientDtoToSummary(patientDto: PatientDto): PatientSummary {
  const firstName = patientDto.firstName?.trim() || ''
  const lastName = patientDto.lastName?.trim() || ''

  return {
    dateOfBirth: patientDto.dateOfBirth ?? null,
    documentNumber: patientDto.documentNumber?.trim() || null,
    email: patientDto.email?.trim() || null,
    firstName,
    fullName: patientDto.fullName?.trim() || `${firstName} ${lastName}`.trim() || 'Sin nombre',
    gender: patientDto.gender ?? null,
    id: patientDto.id,
    instagramAccount: patientDto.instagramAccount?.trim() || null,
    isActive: patientDto.isActive ?? true,
    lastVisitAt: patientDto.lastVisitDate ?? null,
    lastName,
    phone: patientDto.phone?.trim() || null,
    visits: patientDto.visits ?? 0,
  }
}

export function mapPatientListResponseDto(responseDto: PatientListResponseDto): PatientListResult {
  return {
    patients: responseDto.patients?.map(mapPatientDtoToSummary) ?? [],
    total: responseDto.total ?? responseDto.patients?.length ?? 0,
  }
}
