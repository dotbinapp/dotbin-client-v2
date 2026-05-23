import type { LucideIcon } from 'lucide-react'
import type { AppPermission } from '../../permissions/appPermissions.constants'

export interface SidebarNavigationItem {
  path: string
  label: string
  Icon: LucideIcon
}

export interface AppSidebarNavigationItem extends SidebarNavigationItem {
  requiredPermissions: readonly AppPermission[]
}
