import type { KeyboardEvent, MouseEvent } from 'react'

export interface SlotMenuState {
  clientX: number
  clientY: number
  day: Date
  dayKey: string
  slot: string
}

export interface HoverHighlight {
  dayKey: string
  slot: string
}

export type SlotPointerHandler = (event: MouseEvent, day: Date, slot: string) => void
export type SlotKeyboardHandler = (event: KeyboardEvent<HTMLDivElement>, day: Date, dayKey: string, slot: string) => void
export type HoverHighlightHandler = (highlight: HoverHighlight | null) => void
