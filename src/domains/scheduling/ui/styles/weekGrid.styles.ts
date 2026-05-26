export const WEEK_GRID_LINE_CLASS = 'border-b border-ui-grid-line'

export function getSlotHighlightClassName(active: boolean, hover: boolean, fallback: string): string {
  if (active) return 'relative z-30 rounded-md bg-ui-primary-soft font-bold text-ui-primary-text ring-2 ring-inset ring-primary-500/60'
  if (hover) return 'relative z-20 rounded-md bg-ui-primary-soft font-semibold text-ui-primary-text ring-1 ring-inset ring-primary-500/45'

  return fallback
}
