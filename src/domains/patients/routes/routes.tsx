import { lazy } from 'react'

export const PATIENTS_ROUTE_PATH = '/patients'
export const PATIENT_DETAIL_ROUTE_PATH = '/patients/:patientId'
export const PATIENT_DETAIL_PLANS_ROUTE_PATH = `${PATIENT_DETAIL_ROUTE_PATH}/plans`
export const PATIENT_DETAIL_EVOLUTION_ROUTE_PATH = `${PATIENT_DETAIL_ROUTE_PATH}/evolution`
export const PATIENT_DETAIL_HISTORY_ROUTE_PATH = `${PATIENT_DETAIL_ROUTE_PATH}/history`

export const PatientsPage = lazy(() => import('../pages/Patients.page'))
export const PatientDetailPage = lazy(() => import('../pages/PatientDetail.page'))
export const PatientResumePage = lazy(() => import('../pages/PatientResume.page'))
export const PatientPlansPage = lazy(() => import('../pages/PatientPlans.page'))
export const PatientEvolutionPage = lazy(() => import('../pages/PatientEvolution.page'))
export const PatientServiceHistoryPage = lazy(() => import('../pages/PatientServiceHistory.page'))
