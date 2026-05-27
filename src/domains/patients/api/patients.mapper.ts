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
  documentNumber?: string | null
  fullName?: string | null
  id: string
  instagramAccount?: string | null
  isActive?: boolean | null
  lastVisitDate?: string | null
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
    phone: getOptionalNumericText(patient.phone),
  }
}

export function mapPatientDtoToSummary(patientDto: PatientDto): PatientSummary {
  return {
    documentNumber: patientDto.documentNumber?.trim() || null,
    fullName: patientDto.fullName?.trim() || 'Sin nombre',
    id: patientDto.id,
    instagramAccount: patientDto.instagramAccount?.trim() || null,
    isActive: patientDto.isActive ?? true,
    lastVisitAt: patientDto.lastVisitDate ?? null,
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
