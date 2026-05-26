import { useNavigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import type { AppState } from '@auth0/auth0-react'
import type { ReactNode } from 'react'
import { env } from '@shared/config/env'

interface Auth0ProviderWithNavigateProps {
  children: ReactNode
}

function Auth0ProviderWithNavigate({ children }: Readonly<Auth0ProviderWithNavigateProps>) {
  const navigate = useNavigate()

  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo ?? '/dashboard', { replace: true })
  }

  return (
    <Auth0Provider
      cacheLocation="localstorage"
      clientId={env.auth0ClientId}
      domain={env.auth0Domain}
      onRedirectCallback={onRedirectCallback}
      authorizationParams={{
        audience: env.auth0Audience,
        redirect_uri: window.location.origin,
      }}
    >
      {children}
    </Auth0Provider>
  )
}

export default Auth0ProviderWithNavigate
