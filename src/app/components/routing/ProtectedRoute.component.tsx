import { useAuth0 } from '@auth0/auth0-react'
import { LockKeyhole } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@src/app/store'
import type { IdentityAccessPermission } from '@src/domains/identity-access'
import { usePermissions } from '@src/domains/identity-access'
import Text from '@src/shared/ui/atoms/Text.component'
import BaseContainer from '@src/shared/ui/layout/BaseContainer.component'

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: IdentityAccessPermission
  requiredPermissions?: readonly IdentityAccessPermission[]
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-b-2 border-primary-600" />
        <Text tone="muted">Cargando...</Text>
      </div>
    </div>
  )
}

function RestrictedAccessScreen() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <BaseContainer className="max-w-md" padding="lg" surface="solid">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <LockKeyhole aria-hidden="true" size={42} />
        </div>
        <Text as="h2" variant="title">
          Acceso restringido
        </Text>
        <Text className="mb-6 mt-2" tone="muted">
          No tenés los permisos necesarios para acceder a esta sección.
        </Text>
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary-600 px-4 text-sm font-bold text-white shadow-lg shadow-primary-900/20 transition-all duration-200 hover:bg-primary-700"
          to="/dashboard"
        >
          Volver al inicio
        </Link>
      </BaseContainer>
    </div>
  )
}

function isAuthCallbackUrl() {
  const searchParams = new URLSearchParams(window.location.search)

  return searchParams.has('code') && searchParams.has('state')
}

function ProtectedRoute({ children, requiredPermission, requiredPermissions }: Readonly<ProtectedRouteProps>) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  const redirectAttempted = useRef(false)
  const isCallback = isAuthCallbackUrl()
  const sessionStatus = useAppSelector((state) => state.session.status)
  const { checkAccess } = usePermissions()
  const { hasAccess } = checkAccess(requiredPermission, requiredPermissions)
  const requiresPermission = Boolean(requiredPermission || requiredPermissions?.length)

  useEffect(() => {
    if (isCallback) {
      redirectAttempted.current = false
      return
    }

    if (isAuthenticated) {
      redirectAttempted.current = false
      return
    }

    if (!isLoading && !redirectAttempted.current) {
      redirectAttempted.current = true
      void loginWithRedirect({
        appState: {
          returnTo: window.location.pathname,
        },
      })
    }
  }, [isAuthenticated, isCallback, isLoading, loginWithRedirect])

  if (isLoading || isCallback || !isAuthenticated) {
    return <LoadingScreen />
  }

  if (requiresPermission && (sessionStatus === 'idle' || sessionStatus === 'loading')) {
    return <LoadingScreen />
  }

  if (!hasAccess) {
    return <RestrictedAccessScreen />
  }

  return <>{children}</>
}

export default ProtectedRoute
