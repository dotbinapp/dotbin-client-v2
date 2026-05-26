import { NavLink } from 'react-router-dom'
import type { SidebarNavigationItem } from './sidebarNavigation.types'

const SIDEBAR_NAV_ITEM_BASE_CLASS = 'flex items-center justify-center py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden'
const SIDEBAR_NAV_ITEM_ACTIVE_CLASS = 'bg-white/70 text-primary-700 font-bold shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-white/60'
const SIDEBAR_NAV_ITEM_INACTIVE_CLASS = 'text-slate-500 hover:bg-white/40 hover:text-slate-700'

function getNavItemClassName(isActive: boolean) {
  return `${SIDEBAR_NAV_ITEM_BASE_CLASS} ${isActive ? SIDEBAR_NAV_ITEM_ACTIVE_CLASS : SIDEBAR_NAV_ITEM_INACTIVE_CLASS}`
}

function getNavIconClassName(isActive: boolean) {
  return `flex-shrink-0 transition-transform duration-300 ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`
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
