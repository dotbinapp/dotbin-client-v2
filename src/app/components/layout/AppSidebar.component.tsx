import { useMemo } from 'react'
import { useAppSelector } from '@app/store/hooks'
import { selectSessionStatus, usePermissions } from '@domains/identity-access'
import type { AppPermission } from '@domains/identity-access'
import { Skeleton } from '@shared/ui/atoms'
import { BaseContainer } from '@shared/ui/layout'
import SidebarBrand from '../sidebar/SidebarBrand.component'
import SidebarFooter from '../sidebar/SidebarFooter.component'
import SidebarNavGroup from '../sidebar/SidebarNavGroup.component'
import type { AppSidebarNavigationGroup, SidebarNavigationGroup } from '../sidebar/sidebarNavigation.types'

interface AppSidebarProps {
  groups: readonly AppSidebarNavigationGroup[]
  loading?: boolean
  loadingItemCount?: number
  onLogoutClick?: () => void
}

function getVisibleNavigationGroups(
  groups: readonly AppSidebarNavigationGroup[],
  hasAnyPermission: (codes: readonly AppPermission[]) => boolean,
): SidebarNavigationGroup[] {
  return groups
    .map((group) => ({
      label: group.label,
      items: group.items.filter((item) => hasAnyPermission(item.requiredPermissions)),
    }))
    .filter((group) => group.items.length > 0)
}

function AppSidebar({
  groups,
  loading = false,
  loadingItemCount = groups.reduce((total, group) => total + group.items.length, 0),
  onLogoutClick,
}: Readonly<AppSidebarProps>) {
  const sessionStatus = useAppSelector(selectSessionStatus)
  const { hasAnyPermission } = usePermissions()
  const visibleGroups = useMemo(() => getVisibleNavigationGroups(groups, hasAnyPermission), [groups, hasAnyPermission])
  const isNavigationLoading = loading || sessionStatus === 'idle' || sessionStatus === 'loading'

  return (
    <BaseContainer as="aside" className="w-20 h-full self-start hidden md:flex flex-col border-r-0 z-50" padding="none" radius="none">
      <SidebarBrand />

      <nav className="px-3 py-6 space-y-4 z-10 flex-1" aria-label="Navegación principal">
        {isNavigationLoading
          ? Array.from({ length: loadingItemCount }, (_, index) => <Skeleton key={index} size="md" />)
          : visibleGroups.map((group, idx) => <SidebarNavGroup key={group.label} {...group} isLast={idx === visibleGroups.length - 1} />)}
      </nav>

      <SidebarFooter onLogoutClick={onLogoutClick} />
    </BaseContainer>
  )
}

export default AppSidebar
