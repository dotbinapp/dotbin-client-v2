import { CalendarDays, LayoutDashboard, Package, Settings, Stethoscope, Users, VenusAndMars } from 'lucide-react'
import { APP_PERMISSION_CODES } from '@src/app/permissions'
import type { AppSidebarNavigationItem } from './sidebarNavigation.types'

export const APP_SIDEBAR_NAVIGATION_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    Icon: LayoutDashboard,
    requiredPermissions: [APP_PERMISSION_CODES.DASHBOARD_READ],
  },
  {
    path: '/calendar',
    label: 'Calendario',
    Icon: CalendarDays,
    requiredPermissions: [APP_PERMISSION_CODES.CALENDAR_READ],
  },
  {
    path: '/patients',
    label: 'Pacientes',
    Icon: Users,
    requiredPermissions: [APP_PERMISSION_CODES.PATIENTS_LIST_READ],
  },
  {
    path: '/doctors',
    label: 'Doctores',
    Icon: VenusAndMars,
    requiredPermissions: [APP_PERMISSION_CODES.DOCTORS_LIST_READ],
  },
  {
    path: '/treatments',
    label: 'Tratamientos',
    Icon: Stethoscope,
    requiredPermissions: [APP_PERMISSION_CODES.TREATMENTS_LIST_READ],
  },
  {
    path: '/stock',
    label: 'Stock',
    Icon: Package,
    requiredPermissions: [APP_PERMISSION_CODES.STOCK_READ],
  },
  {
    path: '/profile',
    label: 'Perfil',
    Icon: Settings,
    requiredPermissions: [APP_PERMISSION_CODES.SETTINGS_READ],
  },
] satisfies readonly AppSidebarNavigationItem[]
