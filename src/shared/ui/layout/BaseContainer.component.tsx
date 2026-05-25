import type { ComponentProps, ElementType, ReactNode } from 'react'
import { composeClassName } from '../utils/className.utils'

type BaseContainerSurface = 'glass' | 'solid' | 'subtle' | 'transparent'
type BaseContainerPadding = 'none' | 'sm' | 'md' | 'lg'
type BaseContainerRadius = 'lg' | 'xl' | '2xl' | 'full'

interface BaseContainerProps<TElement extends ElementType = 'div'> {
  as?: TElement
  children: ReactNode
  className?: string
  padding?: BaseContainerPadding
  radius?: BaseContainerRadius
  surface?: BaseContainerSurface
  fullHeight?: boolean
}

const BASE_CONTAINER_SURFACE_CLASS: Record<BaseContainerSurface, string> = {
  glass: 'glass-panel',
  solid: 'border border-slate-200 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]',
  subtle: 'border border-white/60 bg-white/55 shadow-[0_2px_8px_rgba(15,23,42,0.06)]',
  transparent: 'bg-transparent',
}

const BASE_CONTAINER_PADDING_CLASS: Record<BaseContainerPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-6',
  lg: 'p-6 md:p-8',
}

const BASE_CONTAINER_RADIUS_CLASS: Record<BaseContainerRadius, string> = {
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  '2xl': 'rounded-[2rem]',
  full: 'rounded-full',
}

function BaseContainer<TElement extends ElementType = 'div'>({
  as,
  children,
  className = '',
  padding = 'md',
  radius = '2xl',
  surface = 'glass',
  fullHeight = false,
  ...props
}: BaseContainerProps<TElement> & Omit<ComponentProps<TElement>, keyof BaseContainerProps<TElement>>) {
  const Component = as ?? 'div'
  const fullHeightClass = fullHeight ? 'h-full' : ''

  return (
    <Component
      className={composeClassName(
        BASE_CONTAINER_SURFACE_CLASS[surface],
        BASE_CONTAINER_PADDING_CLASS[padding],
        BASE_CONTAINER_RADIUS_CLASS[radius],
        fullHeightClass,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default BaseContainer
