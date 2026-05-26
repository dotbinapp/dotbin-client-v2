import { themeClass } from '@shared/styles/theme.styles'
import SidebarNavItem from './SidebarNavItem.component'
import type { SidebarNavigationGroup } from './sidebarNavigation.types'

function SidebarNavGroup({ label, items, isLast }: Readonly<SidebarNavigationGroup & { isLast: boolean }>) {
  return (
    <section
      aria-label={label}
    >
      <ul className={`space-y-1 border-b pb-4 ${themeClass.border.default} ${isLast ? 'border-b-0' : ''}`}>
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
