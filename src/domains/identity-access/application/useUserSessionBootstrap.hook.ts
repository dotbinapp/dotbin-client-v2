import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserSession } from '../api/session.api'
import { selectSessionStatus } from '../state/session.selectors'
import { markSessionLoading, setSession, setSessionError } from '../state/session.slice'

const AUTH_ERROR_STATUSES = new Set([401, 403, 404])

function isAuthError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const status = (error as { status?: number }).status
  const auth0Error = (error as { error?: string }).error

  return (status !== undefined && AUTH_ERROR_STATUSES.has(status)) || auth0Error === 'login_required' || auth0Error === 'consent_required'
}

export function useUserSessionBootstrap() {
  const dispatch = useDispatch()
  const sessionStatus = useSelector(selectSessionStatus)
  const { getAccessTokenSilently, isAuthenticated, isLoading, logout } = useAuth0()

  useEffect(() => {
    if (isLoading || !isAuthenticated || sessionStatus !== 'idle') {
      return
    }

    const loadUserSession = async () => {
      dispatch(markSessionLoading())

      try {
        const token = await getAccessTokenSilently()
        const response = await getUserSession(token)

        dispatch(
          setSession({
            center: response.center
              ? {
                  ...response.center,
                  addressLine1: response.center.addressLine1 ?? null,
                }
              : null,
            doctor: response.doctor ?? null,
            user: response.user,
          }),
        )
      } catch (error) {
        if (isAuthError(error)) {
          logout({ logoutParams: { returnTo: window.location.origin } })
          return
        }

        const message = error instanceof Error ? error.message : 'No se pudo obtener la sesión'
        dispatch(setSessionError(message))
      }
    }

    void loadUserSession()
  }, [dispatch, getAccessTokenSilently, isAuthenticated, isLoading, logout, sessionStatus])
}
