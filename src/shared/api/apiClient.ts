import { env } from '@shared/config/env'

interface RequestOptions extends RequestInit {
  headers?: HeadersInit
}

interface JsonRequestOptions extends Omit<RequestOptions, 'body'> {
  body?: unknown
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
