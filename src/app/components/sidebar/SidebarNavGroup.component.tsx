import SidebarNavItem from './SidebarNavItem.component'
import type { SidebarNavigationGroup } from './sidebarNavigation.types'

function SidebarNavGroup({ label, items, isLast }: Readonly<SidebarNavigationGroup & { isLast: boolean }>) {
  return (
    <section
      aria-label={label}
    >
      <ul className={`space-y-1 border-b border-slate-200 pb-4 dark:border-slate-800 ${isLast ? 'border-b-0' : ''}`}>
        {items.map((item) => (
          <li key={item.path}>
            <SidebarNavItem {...item} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default SidebarNavGroup
