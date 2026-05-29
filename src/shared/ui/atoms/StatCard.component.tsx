import type { ComponentProps } from 'react'
import { BaseContainer } from '@shared/ui/layout'
import { composeClassName } from '../utils/className.utils'
import StatItem from './StatItem.component'
import type { StatItemProps } from './StatItem.component'

type StatCardProps = Omit<StatItemProps, 'className'> & Omit<ComponentProps<typeof BaseContainer>, 'children'> & {
  statClassName?: string
}

function StatCard({
  Icon,
  className = '',
  iconClassName = 'text-ui-primary-text',
  iconContainerClassName = 'size-11 rounded-full bg-ui-primary-soft',
  label,
  padding = 'md',
  radius = 'lg',
  statClassName = '',
  surface = 'solid',
  title,
  ...props
}: Readonly<StatCardProps>) {
  return (
    <BaseContainer
      className={composeClassName('min-w-42', className)}
      padding={padding}
      radius={radius}
      surface={surface}
      {...props}
    >
      <StatItem
        Icon={Icon}
        className={composeClassName('items-center', statClassName)}
        iconClassName={iconClassName}
        iconContainerClassName={iconContainerClassName}
        label={label}
        title={title}
      />
    </BaseContainer>
  )
}

export default StatCard
