import { NavLink } from 'react-router-dom'
import type { SidebarNavigationItem } from './sidebarNavigation.types'

const SIDEBAR_NAV_ITEM_BASE_CLASS = 'flex items-center justify-center py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden'
const SIDEBAR_NAV_ITEM_ACTIVE_CLASS = 'bg-white/70 text-primary-700 font-bold shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-white/60 dark:bg-slate-800/80 dark:text-primary-300 dark:ring-slate-700/60 dark:shadow-black/20'
const SIDEBAR_NAV_ITEM_INACTIVE_CLASS = 'text-slate-500 hover:bg-white/40 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800/70 dark:hover:text-slate-200'

function getNavItemClassName(isActive: boolean) {
  return `${SIDEBAR_NAV_ITEM_BASE_CLASS} ${isActive ? SIDEBAR_NAV_ITEM_ACTIVE_CLASS : SIDEBAR_NAV_ITEM_INACTIVE_CLASS}`
}

function getNavIconClassName(isActive: boolean) {
  return `flex-shrink-0 transition-transform duration-300 ${isActive ? 'text-primary-600 dark:text-primary-300' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-200'}`
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
