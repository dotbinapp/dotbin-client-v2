export interface ProfessionalCreatePayload {
  email?: string
  firstName: string
  lastName: string
  phone?: string
  specialty?: string
}

export interface ProfessionalSummary {
  email: string | null
  firstName: string
  fullName: string
  id: string
  lastName: string
  phone: string | null
  specialty: string | null
}
