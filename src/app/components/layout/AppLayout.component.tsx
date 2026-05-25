import type { ReactNode } from 'react'
import { APP_SIDEBAR_NAVIGATION_ITEMS } from '@src/app/components/sidebar/sidebarNavigation.constants'
import AppSidebar from './AppSidebar.component'

interface AppLayoutProps {
  children: ReactNode
}

function AppLayout({ children }: Readonly<AppLayoutProps>) {
  return (
    <div className="h-screen p-4">
      <div className="flex h-full gap-4">
        <AppSidebar items={APP_SIDEBAR_NAVIGATION_ITEMS} />

        <div className="flex-1 h-full">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AppLayout
