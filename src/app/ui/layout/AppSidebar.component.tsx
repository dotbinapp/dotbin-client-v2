import type { SidebarNavigationItem } from '../sidebar/sidebarNavigation.types'
import BaseContainer from '@src/shared/ui/layout/BaseContainer.component'
import Skeleton from '@src/shared/ui/atoms/Skeleton.component'
import SidebarBrand from '../sidebar/SidebarBrand.component'
import SidebarFooter from '../sidebar/SidebarFooter.component'
import SidebarNavItem from '../sidebar/SidebarNavItem.component'

interface AppSidebarProps {
  items: readonly SidebarNavigationItem[]
  loading?: boolean
  loadingItemCount?: number
  onLogoutClick?: () => void
}

function AppSidebar({ items, loading = false, loadingItemCount = items.length, onLogoutClick }: Readonly<AppSidebarProps>) {
  return (
    <div className="h-full">
      <BaseContainer as="aside" className="w-20 hidden md:flex flex-col border-r-0 z-50 h-full" padding="none">
        <SidebarBrand />

        <nav className="flex-1 px-3 py-6 space-y-3 z-10" aria-label="Navegación principal">
          {loading
            ? Array.from({ length: loadingItemCount }, (_, index) => <Skeleton key={index} size="md" />)
            : items.map((item) => <SidebarNavItem key={item.path} {...item} />)}
        </nav>

        <SidebarFooter onLogoutClick={onLogoutClick} />
      </BaseContainer>
    </div>
  )
}

export default AppSidebar
