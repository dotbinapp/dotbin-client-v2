import type { IdentityAccessPermission } from './identityAccessPermissions.types'

export interface UserProfile {
  auth0Id: string
  email?: string
  metadata?: Record<string, unknown>
  name?: string
  permissions?: IdentityAccessPermission[]
  roles?: string[]
}

export interface CenterSummary {
  addressLine1?: string | null
  hasWhatsappIntegration?: boolean
  id: string
  name?: string | null
  status?: string | null
  timezone?: string | null
  whatsappEnabled?: boolean
}

export interface DoctorSummary {
  id?: string
  [key: string]: unknown
}

export interface UserSession {
  center: CenterSummary | null
  doctor: DoctorSummary | null
  user: UserProfile | null
}

export interface AuthMeResponse extends UserSession {
  ok: boolean
}
