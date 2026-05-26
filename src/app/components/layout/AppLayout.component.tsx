import type { ReactNode } from 'react'
import { APP_SIDEBAR_NAVIGATION_ITEMS } from '@src/app/components/sidebar/sidebarNavigation.constants'
import AppBreadcrumb from './AppBreadcrumb.component'
import AppSidebar from './AppSidebar.component'

interface AppLayoutProps {
  children: ReactNode
}

function AppLayout({ children }: Readonly<AppLayoutProps>) {
  return (
    <div className="h-screen p-4">
      <div className="flex h-full gap-10">
        <AppSidebar items={APP_SIDEBAR_NAVIGATION_ITEMS} />

        <div className="flex h-full min-w-0 flex-1 flex-col gap-4 py-4">
          <AppBreadcrumb />

          <div className="min-h-0 flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppLayout
