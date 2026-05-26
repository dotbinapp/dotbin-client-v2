import { Navigate, useLocation } from 'react-router-dom'
import { DEFAULT_ROUTE } from '@app/router/route.constants'
import { Text } from '@shared/ui/atoms'

function RootRedirect() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const hasAuthParams = searchParams.has('code') || searchParams.has('state')

  if (hasAuthParams) {
    return (
      <div className="flex min-h-screen items-center justify-center" aria-label="Procesando autenticación" role="status">
        <div className="text-center">
          <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-b-2 border-primary-600" />
          <Text tone="muted">Procesando autenticación...</Text>
        </div>
      </div>
    )
  }

  return <Navigate to={DEFAULT_ROUTE} replace />
}

export default RootRedirect
