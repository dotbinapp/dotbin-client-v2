import type { PatientListResult, PatientSummary } from '../model/patient.types'

export interface PatientDto {
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

export function mapPatientDtoToSummary(patientDto: PatientDto): PatientSummary {
  return {
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
