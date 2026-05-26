import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { composeClassName } from '@shared/ui/utils/className.utils'
import {
  getNextSchedulingMonth,
  getNextSchedulingWeek,
  getPreviousSchedulingMonth,
  getPreviousSchedulingWeek,
  getSchedulingMonthWeeks,
  getSchedulingWeek,
  getSchedulingWeekLabel,
  getSchedulingWeekStartValue,
  getSchedulingYearOptions,
  parseIsoDate,
  SCHEDULING_MONTHS,
  WEEK_DAY_INITIALS,
} from '../../utils/weekPicker.utils'

interface WeekPickerProps {
  onChange: (value: string) => void
  value: string
}

const POPUP_MARGIN = 8
const POPUP_WIDTH = 320
const POPUP_MAX_HEIGHT = 380
const POPUP_MIN_HEIGHT = 240
const TRIGGER_ICON_BUTTON_CLASS =
  'cursor-pointer rounded-lg text-slate-500 transition-colors hover:bg-white/60 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40'
const POPUP_ICON_BUTTON_CLASS = 'rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-primary-700'
const SELECT_CLASS =
  'h-9 rounded-xl border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
const WEEK_RANGE_BUTTON_CLASS =
  'grid w-full cursor-pointer grid-cols-7 gap-1 rounded-xl p-1 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white'

function WeekPicker({ onChange, value }: Readonly<WeekPickerProps>) {
  const [isOpen, setIsOpen] = useState(false)
  const [popupStyle, setPopupStyle] = useState<CSSProperties | null>(null)
  const selectedDate = useMemo(() => parseIsoDate(value), [value])
  const [viewDate, setViewDate] = useState(selectedDate)
  const containerRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const weekLabel = useMemo(() => getSchedulingWeekLabel(value), [value])
  const selectedWeekValue = useMemo(() => getSchedulingWeekStartValue(value), [value])
  const yearOptions = useMemo(() => getSchedulingYearOptions(viewDate.getFullYear()), [viewDate])
  const monthWeeks = useMemo(() => getSchedulingMonthWeeks(viewDate.getFullYear(), viewDate.getMonth()), [viewDate])

  const updatePopupPosition = useCallback(() => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const width = Math.min(POPUP_WIDTH, viewportWidth - POPUP_MARGIN * 2)
    const left = Math.max(POPUP_MARGIN, Math.min(rect.left, viewportWidth - width - POPUP_MARGIN))
    const spaceBelow = viewportHeight - rect.bottom - POPUP_MARGIN
    const spaceAbove = rect.top - POPUP_MARGIN
    const openUpwards = spaceBelow < POPUP_MIN_HEIGHT && spaceAbove > spaceBelow
    const availableHeight = openUpwards ? spaceAbove : spaceBelow
    const maxHeight = Math.max(POPUP_MIN_HEIGHT, Math.min(POPUP_MAX_HEIGHT, availableHeight))
    const top = openUpwards
      ? Math.max(POPUP_MARGIN, rect.top - maxHeight - POPUP_MARGIN)
      : Math.min(viewportHeight - maxHeight - POPUP_MARGIN, rect.bottom + POPUP_MARGIN)

    setPopupStyle({ left, maxHeight, top, width })
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const frameId = window.requestAnimationFrame(updatePopupPosition)

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      const clickedTrigger = containerRef.current?.contains(target)
      const clickedPopup = popupRef.current?.contains(target)

      if (!clickedTrigger && !clickedPopup) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    const handleViewportChange = () => updatePopupPosition()

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)

    return () => {
      window.cancelAnimationFrame(frameId)
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
    }
  }, [isOpen, updatePopupPosition])

  const openWeekMenu = () => {
    setViewDate(parseIsoDate(value))
    setIsOpen((currentValue) => !currentValue)
  }

  const changeVisibleMonth = (date: Date) => {
    setViewDate(date)
  }

  const selectWeek = (nextValue: string) => {
    onChange(nextValue)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-flex" ref={containerRef}>
      <div className="flex min-h-11 items-center gap-4 rounded-2xl">
        <button
          aria-label="Ver semana anterior"
          className={TRIGGER_ICON_BUTTON_CLASS}
          onClick={() => onChange(getPreviousSchedulingWeek(value))}
          type="button"
        >
          <ChevronLeft aria-hidden="true" size={18} />
        </button>

        <button
          aria-expanded={isOpen}
          className="cursor-pointer text-xl font-black capitalize tracking-tight text-slate-800 transition-colors hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
          onClick={openWeekMenu}
          type="button"
        >
          {weekLabel}
        </button>

        <button
          aria-label="Ver semana siguiente"
          className={TRIGGER_ICON_BUTTON_CLASS}
          onClick={() => onChange(getNextSchedulingWeek(value))}
          type="button"
        >
          <ChevronRight aria-hidden="true" size={18} />
        </button>
      </div>

      {isOpen && popupStyle
        ? createPortal(
            <div
              className="fixed z-[500] overflow-auto rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200"
              ref={popupRef}
              style={popupStyle}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <button
                  aria-label="Ver mes anterior"
                  className={POPUP_ICON_BUTTON_CLASS}
                  onClick={() => changeVisibleMonth(getPreviousSchedulingMonth(viewDate.getFullYear(), viewDate.getMonth()))}
                  type="button"
                >
                  <ChevronLeft aria-hidden="true" size={16} />
                </button>

                <div className="flex items-center gap-2">
                  <select
                    aria-label="Mes"
                    className={SELECT_CLASS}
                    onChange={(event) => changeVisibleMonth(new Date(viewDate.getFullYear(), Number(event.target.value), 1))}
                    value={viewDate.getMonth()}
                  >
                    {SCHEDULING_MONTHS.map((month) => (
                      <option key={month.label} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="Año"
                    className={composeClassName(SELECT_CLASS, 'w-24')}
                    onChange={(event) => changeVisibleMonth(new Date(Number(event.target.value), viewDate.getMonth(), 1))}
                    value={viewDate.getFullYear()}
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  aria-label="Ver mes siguiente"
                  className={POPUP_ICON_BUTTON_CLASS}
                  onClick={() => changeVisibleMonth(getNextSchedulingMonth(viewDate.getFullYear(), viewDate.getMonth()))}
                  type="button"
                >
                  <ChevronRight aria-hidden="true" size={16} />
                </button>
              </div>

              <div className="mb-1 grid grid-cols-7 gap-1">
                {WEEK_DAY_INITIALS.map((day) => (
                  <span className="py-1 text-center text-[11px] font-bold text-slate-400" key={day}>
                    {day}
                  </span>
                ))}
              </div>

              <ul className="space-y-1">
                {monthWeeks.map((week) => {
                  const isSelected = week.value === selectedWeekValue

                  return (
                    <li key={week.value}>
                      <button
                        aria-label={`Seleccionar semana ${week.label}`}
                        aria-pressed={isSelected}
                        className={composeClassName(
                          WEEK_RANGE_BUTTON_CLASS,
                          isSelected ? 'bg-primary-600 text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-primary-700',
                        )}
                        onClick={() => selectWeek(week.value)}
                        type="button"
                      >
                        {getSchedulingWeek(week.value).map((day) => {
                          const isVisibleMonth = day.date.getMonth() === viewDate.getMonth()

                          return (
                            <span
                              className={composeClassName(
                                'flex h-8 items-center justify-center rounded-lg',
                                isVisibleMonth ? 'opacity-100' : 'opacity-35',
                              )}
                              key={day.isoValue}
                            >
                              {day.numericDay}
                            </span>
                          )
                        })}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}

export default WeekPicker
