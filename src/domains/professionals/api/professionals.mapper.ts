import type { ProfessionalCreatePayload, ProfessionalListResult, ProfessionalSummary } from '../model/professional.types'

export interface ProfessionalCreateRequestDto {
  email?: string
  firstName: string
  lastName: string
  phone?: string
  specialty?: string
}

export interface ProfessionalDto {
  email?: string | null
  firstName?: string | null
  fullName?: string | null
  id: string
  isActive?: boolean | null
  lastName?: string | null
  phone?: string | null
  specialty?: string | null
}

export interface ProfessionalListResponseDto {
  doctors?: ProfessionalDto[]
  ok: boolean
  total?: number
}

export interface ProfessionalCreateResponseDto {
  doctor: ProfessionalDto
  ok: boolean
}

function getOptionalText(value?: string) {
  const normalizedValue = value?.trim()
  return normalizedValue || undefined
}

export function mapProfessionalCreatePayloadToDto(professional: ProfessionalCreatePayload): ProfessionalCreateRequestDto {
  return {
    email: getOptionalText(professional.email),
    firstName: professional.firstName.trim(),
    lastName: professional.lastName.trim(),
    phone: getOptionalText(professional.phone),
    specialty: getOptionalText(professional.specialty),
  }
}

export function mapProfessionalDtoToSummary(professionalDto: ProfessionalDto): ProfessionalSummary {
  const firstName = professionalDto.firstName?.trim() || ''
  const lastName = professionalDto.lastName?.trim() || ''

  return {
    email: professionalDto.email?.trim() || null,
    firstName,
    fullName: professionalDto.fullName?.trim() || `${firstName} ${lastName}`.trim() || 'Sin nombre',
    id: professionalDto.id,
    lastName,
    phone: professionalDto.phone?.trim() || null,
    specialty: professionalDto.specialty?.trim() || null,
  }
}

export function mapProfessionalListResponseDto(responseDto: ProfessionalListResponseDto): ProfessionalListResult {
  return {
    professionals: responseDto.doctors?.map(mapProfessionalDtoToSummary) ?? [],
    total: responseDto.total ?? responseDto.doctors?.length ?? 0,
  }
}
