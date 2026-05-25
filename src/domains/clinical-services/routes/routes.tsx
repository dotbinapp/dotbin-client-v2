import { lazy } from 'react'

export const CLINICAL_SERVICES_TREATMENTS_ROUTE_PATH = '/treatments'
export const ClinicalServicesTreatmentsPage = lazy(() => import('../pages/Treatments.page'))
