import { lazy } from 'react'

export const PATIENTS_ROUTE_PATH = '/patients'
export const PatientsPage = lazy(() => import('../pages/Patients.page'))
