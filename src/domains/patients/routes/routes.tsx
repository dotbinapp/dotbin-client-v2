import { lazy } from 'react'

export const PATIENTS_ROUTE_PATH = '/patients'
export const PATIENT_DETAIL_ROUTE_PATH = '/patients/:patientId'

export const PatientsPage = lazy(() => import('../pages/Patients.page'))
export const PatientDetailPage = lazy(() => import('../pages/PatientDetail.page'))
