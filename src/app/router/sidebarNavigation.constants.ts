import { Building2, CalendarDays, LayoutDashboard, Package, Settings, Users } from 'lucide-react'
import type { SidebarNavigationItem } from '../../shared/types/navigation.types'

export interface AppSidebarNavigationItem extends SidebarNavigationItem {
  requiredPermissions: readonly string[]
}

export const APP_SIDEBAR_NAVIGATION_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    Icon: LayoutDashboard,
    requiredPermissions: ['DASHBOARD_READ'],
  },
  {
    path: '/calendar',
    label: 'Calendario',
    Icon: CalendarDays,
    requiredPermissions: ['CALENDAR_READ'],
  },
  {
    path: '/patients',
    label: 'Pacientes',
    Icon: Users,
    requiredPermissions: ['PATIENTS_LIST_READ'],
  },
  {
    path: '/services',
    label: 'Servicios',
    Icon: Settings,
    requiredPermissions: ['DOCTORS_LIST_READ', 'TREATMENTS_LIST_READ'],
  },
  {
    path: '/stock',
    label: 'Stock',
    Icon: Package,
    requiredPermissions: ['STOCK_READ'],
  },
  {
    path: '/profile',
    label: 'Perfil',
    Icon: Building2,
    requiredPermissions: ['SETTINGS_READ'],
  },
] satisfies readonly AppSidebarNavigationItem[]
