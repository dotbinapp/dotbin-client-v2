import { env } from '@shared/config/env'

interface RequestOptions extends RequestInit {
  headers?: HeadersInit
}

class ApiClient {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<TResponse>(endpoint: string, options: RequestOptions = {}): Promise<TResponse> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = new Error(`HTTP error ${response.status}`) as Error & { status?: number }
      error.status = response.status
      throw error
    }

    return response.json() as Promise<TResponse>
  }

  get<TResponse>(endpoint: string, options?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>(endpoint, { ...options, method: 'GET' })
  }
}

export const apiClient = new ApiClient(env.apiUrl)
