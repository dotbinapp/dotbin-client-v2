import { apiClient } from '@shared/api'
import type { AuthMeResponse } from '../model/session.types'

const AUTH_ME_ENDPOINT = '/v1/auth/me'

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

export function getUserSession(token: string): Promise<AuthMeResponse> {
  return apiClient.get<AuthMeResponse>(AUTH_ME_ENDPOINT, {
    headers: authHeaders(token),
  })
}
