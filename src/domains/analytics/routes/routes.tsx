import { lazy } from 'react'

export const ANALYTICS_DASHBOARD_ROUTE_PATH = '/dashboard'
export const AnalyticsDashboardPage = lazy(() => import('../pages/Dashboard.page'))
