import type { LucideIcon } from 'lucide-react'
import type { AppPermission } from '@domains/identity-access'

export interface SidebarNavigationItem {
  path: string
  label: string
  Icon: LucideIcon
}

export interface SidebarNavigationGroup {
  label: string
  items: readonly SidebarNavigationItem[]
}

export interface AppSidebarNavigationItem extends SidebarNavigationItem {
  requiredPermissions: readonly AppPermission[]
}

export interface AppSidebarNavigationGroup {
  label: string
  items: readonly AppSidebarNavigationItem[]
}
