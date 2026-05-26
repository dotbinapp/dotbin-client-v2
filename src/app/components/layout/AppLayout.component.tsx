import type { ReactNode } from 'react'
import { APP_SIDEBAR_NAVIGATION_GROUPS } from '@app/components/sidebar/sidebarNavigation.constants'
import AppHeader from './AppHeader.component'
import AppSidebar from './AppSidebar.component'

interface AppLayoutProps {
  children: ReactNode
}

function AppLayout({ children }: Readonly<AppLayoutProps>) {
  return (
    <div className="h-screen bg-slate-100 text-slate-700 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-200">
      <div className="flex h-full">
        <AppSidebar groups={APP_SIDEBAR_NAVIGATION_GROUPS} />

        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <AppHeader />

          <div className="min-h-0 flex-1 p-4 pl-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppLayout
