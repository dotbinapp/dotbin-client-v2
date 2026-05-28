import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { APP_SIDEBAR_NAVIGATION_ITEMS } from '@app/components/sidebar/sidebarNavigation.constants'
import { DEFAULT_ROUTE } from '@app/router/route.constants'
import { themeClass } from '@shared/styles/theme.styles'
import { composeClassName } from '@shared/ui/utils/className.utils'

interface BreadcrumbItem {
  label: string
  path?: string
}

function AppBreadcrumb() {
  const { pathname } = useLocation()
  const items = resolveBreadcrumbItems(pathname)

  return (
    <nav aria-label="Ubicación actual" className={`flex items-center text-sm ${themeClass.text.muted}`}>
      <ol className="flex min-w-0 items-center gap-2">
        <li className="flex shrink-0 items-center">
          <Link
            aria-label="Ir al inicio"
            className={`inline-flex size-8 items-center justify-center rounded-xl shadow-sm transition-colors ${themeClass.surface.default} ${themeClass.interactive.ghost}`}
            to={DEFAULT_ROUTE}
          >
            <Home aria-hidden="true" size={16} strokeWidth={2} />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLastItem = index === items.length - 1

          return (
            <li className="flex min-w-0 items-center " key={`${item.label}-${item.path ?? 'current'}`}>
              <ChevronRight aria-hidden="true" className={`shrink-0 ${themeClass.text.subtle}`} size={16} strokeWidth={2} />
              <BreadcrumbSegment item={item} isCurrent={isLastItem} />
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function BreadcrumbSegment({ item, isCurrent }: Readonly<{ item: BreadcrumbItem; isCurrent: boolean }>) {
  const className = composeClassName(
    'inline-flex max-w-48 items-center truncate rounded-xl px-3 py-2 font-semibold transition-colors',
    `${themeClass.text.default} hover:bg-ui-surface-hover hover:text-ui-text`
  )

  if (isCurrent || !item.path) {
    return (
      <span aria-current={isCurrent ? 'page' : undefined} className={className} title={item.label}>
        {item.label}
      </span>
    )
  }

  return (
    <Link className={className} title={item.label} to={item.path}>
      {item.label}
    </Link>
  )
}

function resolveBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean)

  if (pathSegments.length === 0) {
    return [{ label: 'Inicio' }]
  }

  return pathSegments.map((pathSegment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`
    const activeNavigationItem = APP_SIDEBAR_NAVIGATION_ITEMS.find((item) => item.path === path)

    if (activeNavigationItem) {
      return {
        label: activeNavigationItem.label,
        path: index === pathSegments.length - 1 ? undefined : activeNavigationItem.path,
      }
    }

    return { label: humanizePathSegment(pathSegment) }
  })
}

function humanizePathSegment(pathSegment: string) {
  if (isInternalIdPathSegment(pathSegment)) {
    return 'Detalle'
  }

  return pathSegment
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function isInternalIdPathSegment(pathSegment: string) {
  return /\d/.test(pathSegment) && pathSegment.length > 12
}

export default AppBreadcrumb
