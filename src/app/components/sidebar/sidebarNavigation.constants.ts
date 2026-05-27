import { CalendarDays, LayoutDashboard, Package, Stethoscope, Users, VenusAndMars } from 'lucide-react'
import { APP_PERMISSION_CODES } from '@domains/identity-access'
import type { AppSidebarNavigationGroup } from './sidebarNavigation.types'

export const APP_SIDEBAR_NAVIGATION_GROUPS: readonly AppSidebarNavigationGroup[] = [
  {
    label: 'Vista general',
    items: [
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
    ],
  },
  {
    label: 'Atención clínica',
    items: [
      {
        path: '/patients',
        label: 'Pacientes',
        Icon: Users,
        requiredPermissions: [APP_PERMISSION_CODES.PATIENTS_LIST_READ],
      },
      {
        path: '/professionals',
        label: 'Profesionales',
        Icon: VenusAndMars,
        requiredPermissions: [APP_PERMISSION_CODES.DOCTORS_LIST_READ],
      },
      {
        path: '/treatments',
        label: 'Tratamientos',
        Icon: Stethoscope,
        requiredPermissions: [APP_PERMISSION_CODES.TREATMENTS_LIST_READ],
      },
    ],
  },
  {
    label: 'Inventario',
    items: [
      {
        path: '/stock',
        label: 'Stock',
        Icon: Package,
        requiredPermissions: [APP_PERMISSION_CODES.STOCK_READ],
      },
    ],
  },
] as const

export const APP_SIDEBAR_NAVIGATION_ITEMS = APP_SIDEBAR_NAVIGATION_GROUPS.flatMap((group) => group.items)
