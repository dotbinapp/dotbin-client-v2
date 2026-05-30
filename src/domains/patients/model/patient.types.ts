export type PatientListSortField = 'fullName'
export type PatientListSortDirection = 'asc' | 'desc'
export type PatientGender = 'female' | 'male'
export type PatientTreatmentPlanFrequency = 'ANNUAL' | 'BIWEEKLY' | 'DAILY' | 'MONTHLY' | 'WEEKLY'
export type PatientTreatmentPlanPaymentStatus = 'paid' | 'partial' | 'unpaid'
export type PatientTreatmentPlanStatus = 'ACTIVE' | 'COMPLETED'

export interface PatientTreatmentPlanTreatmentSummary {
  id: string
  name: string
}

export interface PatientTreatmentPlanProfessionalSummary {
  id: string
  name: string
}

export interface PatientSummary {
  dateOfBirth: string | null
  documentNumber: string | null
  email: string | null
  firstName: string
  fullName: string
  gender: PatientGender | null
  id: string
  instagramAccount: string | null
  isActive: boolean
  lastVisitAt: string | null
  lastName: string
  phone: string | null
  visits: number
}

export interface PatientMedicalInfo {
  information: string
  title: string
}

export interface PatientDetail extends PatientSummary {
  lastServiceName: string | null
  nextVisitAt: string | null
  patientMedicalInfo: PatientMedicalInfo[]
}

export interface PatientTreatmentPlan {
  completedSessions: number
  createdAt: string | null
  frequency: PatientTreatmentPlanFrequency | null
  id: string
  isPaid: boolean | null
  notes: string | null
  paidAmount: number | null
  professional: PatientTreatmentPlanProfessionalSummary | null
  serviceId: string
  serviceName: string
  startDate: string | null
  status: PatientTreatmentPlanStatus
  totalCost: number | null
  totalSessions: number
  treatments: PatientTreatmentPlanTreatmentSummary[]
}

export interface PatientTreatmentPlanCreatePayload {
  frequency: PatientTreatmentPlanFrequency
  generateSessions: boolean
  notes?: string
  paidAmount: number
  paymentStatus: PatientTreatmentPlanPaymentStatus
  professionalId?: string
  startDate: string
  totalCost: number
  totalSessions: number
  treatmentIds: string[]
}

export interface PatientTreatmentPlanUpdatePayload {
  completedSessions?: number
  frequency?: PatientTreatmentPlanFrequency | null
  id: string
  notes?: string | null
  paidAmount?: number | null
  paymentStatus?: PatientTreatmentPlanPaymentStatus
  professionalId?: string | null
  startDate?: string | null
  status?: PatientTreatmentPlanStatus
  totalCost?: number | null
  totalSessions: number
  treatmentIds: string[]
}

export interface PatientTreatmentPlanLookupOption {
  id: string
  name: string
}

export interface PatientCreatePayload {
  dateOfBirth?: string
  documentNumber?: number
  email?: string
  firstName: string
  gender?: PatientGender | ''
  instagramAccount?: string
  lastName: string
  phone?: string
}

export interface PatientUpdatePayload extends Partial<PatientCreatePayload> {
  patientMedicalInfo?: PatientMedicalInfo[]
  treatmentPlans?: PatientTreatmentPlanUpdatePayload[]
}

export interface PatientListParams {
  isActive?: boolean
  limit: number
  offset: number
  searchTerm?: string
  sortDirection?: PatientListSortDirection
  sortField?: PatientListSortField
}

export interface PatientListResult {
  patients: PatientSummary[]
  total: number
}
