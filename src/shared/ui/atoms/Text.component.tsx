import type { ComponentProps, ElementType, ReactNode } from 'react'
import { composeClassName } from '../utils/className.utils'

type TextVariant = 'title' | 'subtitle' | 'body' | 'label' | 'caption'
type TextTone = 'default' | 'muted' | 'primary' | 'danger' | 'success'

interface TextProps<TElement extends ElementType = 'p'> {
  as?: TElement
  children: ReactNode
  className?: string
  tone?: TextTone
  variant?: TextVariant
}

const TEXT_VARIANT_CLASS: Record<TextVariant, string> = {
  title: 'font-heading text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl md:text-4xl',
  subtitle: 'text-sm font-medium leading-relaxed text-slate-500 sm:text-base md:text-lg',
  body: 'text-base leading-7 text-slate-600',
  label: 'text-sm font-bold text-slate-700',
  caption: 'text-xs font-semibold text-slate-500',
}

const TEXT_TONE_CLASS: Record<TextTone, string> = {
  default: '',
  muted: 'text-slate-500',
  primary: 'text-primary-700',
  danger: 'text-red-600',
  success: 'text-emerald-700',
}

function Text<TElement extends ElementType = 'p'>({
  as,
  children,
  className = '',
  tone = 'default',
  variant = 'body',
  ...props
}: TextProps<TElement> & Omit<ComponentProps<TElement>, keyof TextProps<TElement>>) {
  const Component = as ?? 'p'

  return (
    <Component className={composeClassName(TEXT_VARIANT_CLASS[variant], TEXT_TONE_CLASS[tone], className)} {...props}>
      {children}
    </Component>
  )
}

export default Text
