import type { ReactNode } from 'react'
import { useUserSessionBootstrap } from '@src/domains/identity-access'

interface AppSessionBootstrapProps {
  children: ReactNode
}

function AppSessionBootstrap({ children }: Readonly<AppSessionBootstrapProps>) {
  useUserSessionBootstrap()

  return <>{children}</>
}

export default AppSessionBootstrap
