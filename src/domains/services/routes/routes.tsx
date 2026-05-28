import { lazy } from 'react'

export const SERVICES_ROUTE_PATH = '/services'
export const LEGACY_TREATMENTS_ROUTE_PATH = '/treatments'
export const ServicesPage = lazy(() => import('../pages/Services.page'))
