import { env } from '@shared/config/env'

interface RequestOptions extends RequestInit {
  headers?: HeadersInit
}

interface JsonRequestOptions extends Omit<RequestOptions, 'body'> {
  body?: unknown
}

interface ApiErrorPayload {
  code?: string
  detail?: string
  message?: string
}

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  return typeof value === 'object' && value !== null
}

async function getApiErrorPayload(response: Response): Promise<ApiErrorPayload | null> {
  try {
    const payload: unknown = await response.json()
    return isApiErrorPayload(payload) ? payload : null
  } catch {
    return null
  }
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
      const errorPayload = await getApiErrorPayload(response)
      const error = new Error(errorPayload?.message || `HTTP error ${response.status}`) as Error & { code?: string; detail?: string; status?: number }
      error.code = errorPayload?.code
      error.detail = errorPayload?.detail
      error.status = response.status
      throw error
    }

    if (response.status === 204) {
      return undefined as TResponse
    }

    return response.json() as Promise<TResponse>
  }

  private requestWithJsonBody<TResponse>(endpoint: string, method: string, options: JsonRequestOptions = {}): Promise<TResponse> {
    const { body, ...requestOptions } = options

    return this.request<TResponse>(endpoint, {
      ...requestOptions,
      body: body === undefined ? undefined : JSON.stringify(body),
      method,
    })
  }

  get<TResponse>(endpoint: string, options?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>(endpoint, { ...options, method: 'GET' })
  }

  post<TResponse>(endpoint: string, options?: JsonRequestOptions): Promise<TResponse> {
    return this.requestWithJsonBody<TResponse>(endpoint, 'POST', options)
  }

  put<TResponse>(endpoint: string, options?: JsonRequestOptions): Promise<TResponse> {
    return this.requestWithJsonBody<TResponse>(endpoint, 'PUT', options)
  }

  patch<TResponse>(endpoint: string, options?: JsonRequestOptions): Promise<TResponse> {
    return this.requestWithJsonBody<TResponse>(endpoint, 'PATCH', options)
  }

  delete<TResponse>(endpoint: string, options?: JsonRequestOptions): Promise<TResponse> {
    return this.requestWithJsonBody<TResponse>(endpoint, 'DELETE', options)
  }
}

export const apiClient = new ApiClient(env.apiUrl)
