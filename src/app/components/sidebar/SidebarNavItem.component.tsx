import { NavLink } from 'react-router-dom'
import { themeClass } from '@shared/styles/theme.styles'
import type { SidebarNavigationItem } from './sidebarNavigation.types'

const SIDEBAR_NAV_ITEM_BASE_CLASS = 'flex items-center justify-center py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden'
const SIDEBAR_NAV_ITEM_ACTIVE_CLASS = `bg-ui-surface-elevated ${themeClass.text.primary} font-bold shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-ui-border`
const SIDEBAR_NAV_ITEM_INACTIVE_CLASS = `${themeClass.text.subtle} hover:bg-ui-surface-hover hover:text-ui-text`

function getNavItemClassName(isActive: boolean) {
  return `${SIDEBAR_NAV_ITEM_BASE_CLASS} ${isActive ? SIDEBAR_NAV_ITEM_ACTIVE_CLASS : SIDEBAR_NAV_ITEM_INACTIVE_CLASS}`
}

function getNavIconClassName(isActive: boolean) {
  return `flex-shrink-0 transition-transform duration-300 ${isActive ? themeClass.text.primary : `${themeClass.text.subtle} group-hover:text-ui-text`}`
}

function SidebarNavItem({ path, label, Icon }: Readonly<SidebarNavigationItem>) {
  return (
    <NavLink
      to={path}
      title={label}
      aria-label={label}
      className={({ isActive }) => getNavItemClassName(isActive)}
    >
      {({ isActive }) => <Icon size={22} aria-hidden="true" className={getNavIconClassName(isActive)} />}
    </NavLink>
  )
}

export default SidebarNavItem
