import type { ReactNode } from 'react'
import { APP_SIDEBAR_NAVIGATION_ITEMS } from '@src/app/ui/sidebar/sidebarNavigation.constants'
import BaseContainer from '@src/shared/ui/layout/BaseContainer.component'
import AppSidebar from './AppSidebar.component'

interface AppLayoutProps {
  children: ReactNode
}

function AppLayout({ children }: Readonly<AppLayoutProps>) {
  return (
    <div className="min-h-screen p-4">
      <div className="mesh-bg" />
      <div className="flex min-h-[calc(100vh-2rem)] gap-4">
        <AppSidebar items={APP_SIDEBAR_NAVIGATION_ITEMS} />

        <BaseContainer as="main" className="flex-1" padding="lg">
          {children}
        </BaseContainer>
      </div>
    </div>
  )
}

export default AppLayout
