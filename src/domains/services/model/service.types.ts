export interface ServiceCreatePayload {
  cost: number
  depositAmount?: number
  description?: string
  durationMinutes: number
  name: string
  postServiceInstructions?: string
  requiresDeposit: boolean
}

export interface ServiceSummary {
  category: string
  cost: number
  depositAmount: number | null
  description: string | null
  durationMinutes: number
  hasPostServiceInstructions: boolean
  id: string
  name: string
  requiresDeposit: boolean
}
