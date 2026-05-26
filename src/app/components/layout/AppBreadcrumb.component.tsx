import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { APP_SIDEBAR_NAVIGATION_ITEMS } from '@app/components/sidebar/sidebarNavigation.constants'
import { DEFAULT_ROUTE } from '@app/router/route.constants'
import { composeClassName } from '@shared/ui/utils/className.utils'

interface BreadcrumbItem {
  label: string
  path?: string
}

function AppBreadcrumb() {
  const { pathname } = useLocation()
  const currentItem = resolveCurrentBreadcrumbItem(pathname)
  const items = [currentItem]

  return (
    <nav aria-label="Ubicación actual" className="flex items-center text-sm text-slate-500">
      <ol className="flex min-w-0 items-center gap-2">
        <li className="flex shrink-0 items-center">
          <Link
            aria-label="Ir al inicio"
            className="inline-flex size-8 items-center justify-center rounded-xl border border-slate-200/80 bg-white/65 text-slate-500 shadow-sm transition-colors hover:bg-white hover:text-slate-800"
            to={DEFAULT_ROUTE}
          >
            <Home aria-hidden="true" size={16} strokeWidth={2} />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLastItem = index === items.length - 1

          return (
            <li className="flex min-w-0 items-center " key={`${item.label}-${item.path ?? 'current'}`}>
              <ChevronRight aria-hidden="true" className="shrink-0 text-slate-300" size={16} strokeWidth={2} />
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
    'text-slate-600 hover:bg-white/50 hover:text-slate-900'
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

function resolveCurrentBreadcrumbItem(pathname: string): BreadcrumbItem {
  const activeNavigationItem = APP_SIDEBAR_NAVIGATION_ITEMS.find((item) => item.path === pathname)

  if (activeNavigationItem) {
    return { label: activeNavigationItem.label }
  }

  return { label: humanizePathname(pathname) }
}

function humanizePathname(pathname: string) {
  const lastPathSegment = pathname.split('/').filter(Boolean).at(-1)

  if (!lastPathSegment) {
    return 'Inicio'
  }

  return lastPathSegment
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

export default AppBreadcrumb
