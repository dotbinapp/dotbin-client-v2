import type { LucideIcon } from 'lucide-react'
import { Text } from '@shared/ui/atoms'
import { composeClassName } from '../utils/className.utils'

export interface StatItemProps {
  Icon: LucideIcon
  className?: string
  iconClassName?: string
  iconContainerClassName?: string
  label: string
  title: string | number
}

function StatItem({ Icon, className = '', iconClassName = '', iconContainerClassName = '', label, title }: Readonly<StatItemProps>) {
  const icon = (
    <Icon
      aria-hidden="true"
      className={composeClassName(iconContainerClassName ? '' : 'mt-0.5', 'shrink-0 text-ui-text-muted', iconClassName)}
      size={22}
      strokeWidth={2}
    />
  )

  return (
    <div className={composeClassName('flex items-start gap-3', className)}>
      {iconContainerClassName ? (
        <span className={composeClassName('flex shrink-0 items-center justify-center', iconContainerClassName)}>
          {icon}
        </span>
      ) : icon}
      <div className="flex min-w-0 flex-col leading-tight">
        <Text variant="caption">{label}</Text>
        <Text variant="label">{title}</Text>
      </div>
    </div>
  )
}

export default StatItem
