import SidebarNavItem from './SidebarNavItem.component'
import type { SidebarNavigationGroup } from './sidebarNavigation.types'

function SidebarNavGroup({ label, items }: Readonly<SidebarNavigationGroup>) {
  return (
    <section
      aria-label={label}
    >
      <ul className="space-y-1">
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
