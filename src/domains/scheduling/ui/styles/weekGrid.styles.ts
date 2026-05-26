export const WEEK_GRID_LINE_CLASS = 'border-b border-slate-200/70'

export function getSlotHighlightClassName(active: boolean, hover: boolean, fallback: string): string {
  if (active) return 'relative z-30 rounded-md bg-primary-200/45 font-bold text-primary-900 ring-2 ring-inset ring-primary-600/70'
  if (hover) return 'relative z-20 rounded-md bg-primary-100/35 font-semibold text-primary-700 ring-1 ring-inset ring-primary-500/45'

  return fallback
}
