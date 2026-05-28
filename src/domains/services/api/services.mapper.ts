import type { ServiceCreatePayload, ServiceListResult, ServiceSummary } from '../model'

export interface ServiceCreateRequestDto {
  aftercareNotes?: string
  centerId: string
  depositAmount?: number
  description?: string
  durationMinutes: number
  name: string
  price: number
  requiresDeposit?: boolean
}

export interface ServiceUpdateRequestDto extends ServiceCreateRequestDto {
  id: string
  treatmentId: string
}

export interface ServiceDto {
  aftercareNotes?: string | null
  depositAmount?: number | null
  description?: string | null
  durationMinutes?: number | null
  id: string
  name?: string | null
  price?: number | null
  requiresDeposit?: boolean | null
}

export interface ServiceListResponseDto {
  ok: boolean
  total?: number
  treatments?: ServiceDto[]
}

export interface ServiceCreateResponseDto {
  ok: boolean
  treatment: ServiceDto
}

function getOptionalText(value?: string) {
  const normalizedValue = value?.trim()
  return normalizedValue || undefined
}

export function mapServiceCreatePayloadToDto(centerId: string, service: ServiceCreatePayload): ServiceCreateRequestDto {
  return {
    aftercareNotes: getOptionalText(service.postServiceInstructions),
    centerId,
    depositAmount: service.requiresDeposit ? service.depositAmount : undefined,
    description: getOptionalText(service.description),
    durationMinutes: service.durationMinutes,
    name: service.name.trim(),
    price: service.cost,
    requiresDeposit: service.requiresDeposit,
  }
}

export function mapServiceUpdatePayloadToDto(centerId: string, serviceId: string, service: ServiceCreatePayload): ServiceUpdateRequestDto {
  return {
    ...mapServiceCreatePayloadToDto(centerId, service),
    id: serviceId,
    treatmentId: serviceId,
  }
}

export function mapServiceDtoToSummary(serviceDto: ServiceDto): ServiceSummary {
  const aftercareNotes = serviceDto.aftercareNotes?.trim() || null

  return {
    category: null,
    cost: serviceDto.price ?? 0,
    depositAmount: serviceDto.depositAmount ?? null,
    description: serviceDto.description?.trim() || null,
    durationMinutes: serviceDto.durationMinutes ?? 0,
    hasPostServiceInstructions: Boolean(aftercareNotes),
    id: serviceDto.id,
    name: serviceDto.name?.trim() || 'Sin nombre',
    postServiceInstructions: aftercareNotes,
    requiresDeposit: serviceDto.requiresDeposit ?? false,
  }
}

export function mapServiceListResponseDto(responseDto: ServiceListResponseDto): ServiceListResult {
  return {
    services: responseDto.treatments?.map(mapServiceDtoToSummary) ?? [],
    total: responseDto.total ?? responseDto.treatments?.length ?? 0,
  }
}
