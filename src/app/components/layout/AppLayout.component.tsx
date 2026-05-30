import type { ReactNode } from 'react'
import { APP_SIDEBAR_NAVIGATION_GROUPS } from '@app/components/sidebar/sidebarNavigation.constants'
import { themeClass } from '@shared/styles/theme.styles'
import AppHeader from './AppHeader.component'
import AppSidebar from './AppSidebar.component'

interface AppLayoutProps {
  children: ReactNode
}

function AppLayout({ children }: Readonly<AppLayoutProps>) {
  return (
    <div className={`h-screen ${themeClass.layout.app}`}>
      <div className="flex h-full">
        <AppSidebar groups={APP_SIDEBAR_NAVIGATION_GROUPS} />

        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <AppHeader />

          <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-4 pl-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppLayout
