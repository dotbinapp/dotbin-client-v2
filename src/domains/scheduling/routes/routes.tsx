import { lazy } from 'react'

export const SCHEDULING_CALENDAR_ROUTE_PATH = '/calendar'
export const SchedulingCalendarPage = lazy(() => import('../pages/Calendar.page'))
