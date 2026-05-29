import { Link, useLocation } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { themeClass } from '../../styles/theme.styles'
import { composeClassName } from '../utils/className.utils'

export interface TabItem {
  Icon: LucideIcon
  label: string
  path: string
}

interface TabsProps {
  ariaLabel?: string
  className?: string
  tabs: readonly TabItem[]
}

const TAB_BASE_CLASS =
  `inline-flex min-h-10 items-center gap-2 whitespace-nowrap border-b-2 px-4 text-sm font-bold transition-colors duration-200 ${themeClass.focus}`
const TAB_ACTIVE_CLASS = 'border-primary-500 text-ui-primary-text'
const TAB_INACTIVE_CLASS = 'border-transparent text-ui-text-muted hover:border-ui-border-strong hover:text-ui-text'

function getTabPath(path: string, pathname: string) {
  return path.startsWith('#') ? `${pathname}${path}` : path
}

function isTabActive(tabPath: string, currentPath: string, pathname: string, hasHash: boolean, index: number) {
  if (currentPath === tabPath) return true
  if (hasHash) return false

  const [tabPathname, tabHash] = tabPath.split('#')
  if (!tabHash) return tabPathname === pathname

  return index === 0 && tabPathname === pathname
}

function Tabs({ ariaLabel = 'Secciones', className = '', tabs }: Readonly<TabsProps>) {
  const location = useLocation()
  const currentPath = `${location.pathname}${location.hash}`

  return (
    <nav aria-label={ariaLabel} className={composeClassName('overflow-x-auto', className)}>
      <ul role="list" className="flex min-w-max items-center gap-1">
        {tabs.map((tab, index) => {
          const tabPath = getTabPath(tab.path, location.pathname)
          const isActive = isTabActive(tabPath, currentPath, location.pathname, Boolean(location.hash), index)

          return (
            <li key={tab.path}>
              <Link
                aria-current={isActive ? 'page' : undefined}
                className={composeClassName(TAB_BASE_CLASS, isActive ? TAB_ACTIVE_CLASS : TAB_INACTIVE_CLASS)}
                to={tab.path}
              >
                <tab.Icon aria-hidden="true" size={16} strokeWidth={2.2} />
                {tab.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Tabs
