import { lazy } from 'react'

export const DOCTORS_ROUTE_PATH = '/doctors'
export const DoctorsPage = lazy(() => import('../pages/Doctors.page'))
