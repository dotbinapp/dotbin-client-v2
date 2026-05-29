import type { PatientCreatePayload, PatientDetail, PatientListResult, PatientSummary, PatientTreatmentPlan, PatientTreatmentPlanFrequency, PatientTreatmentPlanStatus } from '../model/patient.types'

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
  lastServiceName?: string | null
  lastVisitDate?: string | null
  lastName?: string | null
  nextVisitDate?: string | null
  phone?: string | null
  treatmentPlans?: PatientTreatmentPlanDto[] | null
  visits?: number | null
}

export interface PatientTreatmentPlanTreatmentDto {
  id?: string | null
  name?: string | null
}

export interface PatientTreatmentPlanDto {
  completedSessions?: number | null
  frequency?: PatientTreatmentPlanFrequency | null
  id?: string | null
  itsPaid?: boolean | null
  notes?: string | null
  paidAmount?: number | null
  startDate?: string | null
  status?: PatientTreatmentPlanStatus | null
  totalCost?: number | null
  totalSessions?: number | null
  treatment?: PatientTreatmentPlanTreatmentDto | null
  treatmentId?: string | null
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

export interface PatientDetailResponseDto {
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

export function mapPatientDtoToDetail(patientDto: PatientDto): PatientDetail {
  return {
    ...mapPatientDtoToSummary(patientDto),
    lastServiceName: patientDto.lastServiceName?.trim() || null,
    nextVisitAt: patientDto.nextVisitDate ?? null,
  }
}

export function mapPatientListResponseDto(responseDto: PatientListResponseDto): PatientListResult {
  return {
    patients: responseDto.patients?.map(mapPatientDtoToSummary) ?? [],
    total: responseDto.total ?? responseDto.patients?.length ?? 0,
  }
}

function getNumberOrNull(value?: number | string | null) {
  if (value === null || value === undefined) return null

  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : null
}

function getPlanStatus(planDto: PatientTreatmentPlanDto): PatientTreatmentPlanStatus {
  if (planDto.status) return planDto.status

  const completedSessions = planDto.completedSessions ?? 0
  const totalSessions = planDto.totalSessions ?? 0

  return totalSessions > 0 && completedSessions >= totalSessions ? 'COMPLETED' : 'ACTIVE'
}

export function mapPatientTreatmentPlanDtoToPlan(planDto: PatientTreatmentPlanDto): PatientTreatmentPlan {
  const serviceId = planDto.treatmentId?.trim() || planDto.treatment?.id?.trim() || 'sin-servicio'

  return {
    completedSessions: planDto.completedSessions ?? 0,
    frequency: planDto.frequency ?? null,
    id: planDto.id?.trim() || `${serviceId}-${planDto.startDate ?? 'sin-fecha'}`,
    isPaid: typeof planDto.itsPaid === 'boolean' ? planDto.itsPaid : null,
    notes: planDto.notes?.trim() || null,
    paidAmount: getNumberOrNull(planDto.paidAmount),
    serviceId,
    serviceName: planDto.treatment?.name?.trim() || 'Servicio sin nombre',
    startDate: planDto.startDate ?? null,
    status: getPlanStatus(planDto),
    totalCost: getNumberOrNull(planDto.totalCost),
    totalSessions: planDto.totalSessions ?? 0,
  }
}

export function mapPatientTreatmentPlansResponseDto(responseDto: PatientListResponseDto): PatientTreatmentPlan[] {
  return responseDto.patients?.[0]?.treatmentPlans?.map(mapPatientTreatmentPlanDtoToPlan) ?? []
}
