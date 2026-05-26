export const themeClass = {
  border: {
    default: 'border-ui-border',
    strong: 'border-ui-border-strong',
  },
  focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ui-background',
  interactive: {
    ghost: 'text-ui-text-muted hover:bg-ui-surface-hover hover:text-ui-text',
    primarySoft: 'bg-ui-primary-soft text-ui-primary-text hover:brightness-105',
  },
  layout: {
    app: 'bg-ui-background text-ui-text transition-colors duration-200',
    header: 'border-ui-border bg-ui-background/30 transition-colors duration-200',
  },
  surface: {
    default: 'border border-ui-border bg-ui-surface',
    elevated: 'border border-ui-border bg-ui-surface-elevated shadow-xl shadow-slate-900/10',
    muted: 'border border-ui-border bg-ui-surface-muted',
    transparent: 'bg-transparent',
  },
  text: {
    default: 'text-ui-text',
    muted: 'text-ui-text-muted',
    primary: 'text-ui-primary-text',
    subtle: 'text-ui-text-subtle',
  },
} as const
