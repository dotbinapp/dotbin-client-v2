type ViteEnv = Record<string, string | undefined>

function readEnv(key: string): string | undefined {
  const value = (import.meta.env as ViteEnv)[key]

  if (!value || value === 'undefined') {
    return undefined
  }

  return value
}

function requiredEnv(key: string): string {
  const value = readEnv(key)

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  return value
}

export const env = {
  apiUrl: readEnv('VITE_API_URL') ?? 'http://localhost:3000',
  auth0Audience: readEnv('VITE_AUTH0_AUDIENCE'),
  auth0ClientId: requiredEnv('VITE_AUTH0_CLIENT_ID'),
  auth0Domain: requiredEnv('VITE_AUTH0_DOMAIN'),
} as const
