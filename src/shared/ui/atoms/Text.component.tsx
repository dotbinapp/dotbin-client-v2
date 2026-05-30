import type { ComponentProps, ElementType, ReactNode } from 'react'
import { themeClass } from '../../styles/theme.styles'
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
  title: `font-heading text-2xl font-bold tracking-tight ${themeClass.text.default} sm:text-3xl md:text-4xl`,
  subtitle: `text-sm font-medium leading-relaxed ${themeClass.text.muted} sm:text-base md:text-lg`,
  body: `text-base leading-7 ${themeClass.text.default}`,
  label: `text-sm font-bold ${themeClass.text.default}`,
  caption: `text-xs font-semibold ${themeClass.text.muted}`,
}

const TEXT_TONE_CLASS: Record<TextTone, string> = {
  default: '',
  muted: themeClass.text.muted,
  primary: themeClass.text.primary,
  danger: 'text-red-600 dark:text-red-300',
  success: 'text-emerald-700 dark:text-emerald-300',
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
