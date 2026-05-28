import type { ComponentProps } from 'react'

interface SkeletonProps extends ComponentProps<'div'> {
  size?: 'sm' | 'md' | 'lg'
  fullHeight?: boolean
}

const SKELETON_SIZE_CLASS = {
  sm: 'h-4',
  md: 'h-6',
  lg: 'h-8',
} as const

function Skeleton({ size = 'sm', fullHeight = false, className = '', ...props }: Readonly<SkeletonProps>) {
  const heightClass = fullHeight ? 'h-full' : SKELETON_SIZE_CLASS[size]

  return (
    <div
      className={`w-full ${heightClass} rounded-[2rem] bg-gradient-to-r from-ui-skeleton-from via-ui-skeleton-via to-ui-skeleton-from bg-[length:200%_100%] animate-shimmer ${className}`}
      {...props}
    />
  )
}

export default Skeleton
