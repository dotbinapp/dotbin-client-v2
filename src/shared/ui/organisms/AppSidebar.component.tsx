import type { SidebarNavigationItem } from '../../types/navigation.types'
import SidebarBrand from '../atoms/SidebarBrand.component'
import SidebarFooter from '../atoms/SidebarFooter.component'
import SidebarNavItem from '../atoms/SidebarNavItem.component'
import Skeleton from '../atoms/Skeleton.component'

interface AppSidebarProps {
  items: readonly SidebarNavigationItem[]
  loading?: boolean
  loadingItemCount?: number
  onLogoutClick?: () => void
}

function AppSidebar({ items, loading = false, loadingItemCount = items.length, onLogoutClick }: Readonly<AppSidebarProps>) {
  return (
    <div className="py-2 h-full">
      <aside className="w-20 hidden md:flex flex-col rounded-[2rem] glass-panel border-r-0 shadow-[0_4px_12px_rgba(0,0,0,0.08)] z-50 h-full">
        <SidebarBrand />

        <nav className="flex-1 px-3 py-6 space-y-3 z-10" aria-label="Navegación principal">
          {loading
            ? Array.from({ length: loadingItemCount }, (_, index) => <Skeleton key={index} size="md" />)
            : items.map((item) => <SidebarNavItem key={item.path} {...item} />)}
        </nav>

        <SidebarFooter onLogoutClick={onLogoutClick} />
      </aside>
    </div>
  )
}

export default AppSidebar
