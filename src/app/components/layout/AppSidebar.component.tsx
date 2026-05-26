import type { SidebarNavigationGroup } from '../sidebar/sidebarNavigation.types'
import { Skeleton } from '@shared/ui/atoms'
import { BaseContainer } from '@shared/ui/layout'
import SidebarBrand from '../sidebar/SidebarBrand.component'
import SidebarFooter from '../sidebar/SidebarFooter.component'
import SidebarNavGroup from '../sidebar/SidebarNavGroup.component'

interface AppSidebarProps {
  groups: readonly SidebarNavigationGroup[]
  loading?: boolean
  loadingItemCount?: number
  onLogoutClick?: () => void
}

function AppSidebar({
  groups,
  loading = false,
  loadingItemCount = groups.reduce((total, group) => total + group.items.length, 0),
  onLogoutClick,
}: Readonly<AppSidebarProps>) {
  return (
    <BaseContainer as="aside" className="w-20 h-full self-start hidden md:flex flex-col border-r-0 z-50" padding="none" radius="none">
      <SidebarBrand />

      <nav className="px-3 py-6 space-y-4 z-10 flex-1" aria-label="Navegación principal">
        {loading
          ? Array.from({ length: loadingItemCount }, (_, index) => <Skeleton key={index} size="md" />)
          : groups.map((group, idx) => <SidebarNavGroup key={group.label} {...group} isLast={idx === groups.length - 1} />)}
      </nav>

      <SidebarFooter onLogoutClick={onLogoutClick} />
    </BaseContainer>
  )
}

export default AppSidebar
