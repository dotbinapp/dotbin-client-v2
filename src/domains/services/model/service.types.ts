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
  description: string | null
  durationMinutes: number
  id: string
  name: string
}
