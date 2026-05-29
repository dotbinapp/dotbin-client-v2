import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PageLoader, ProtectedRoute, RootRedirect } from '@app/components/routing'
import { DEFAULT_ROUTE } from '@app/router/route.constants'
import { ANALYTICS_DASHBOARD_ROUTE_PATH, AnalyticsDashboardPage } from '@domains/analytics'
import { CENTER_MANAGEMENT_PROFILE_ROUTE_PATH, CenterManagementProfilePage } from '@domains/center-management'
import { APP_PERMISSION_CODES } from '@domains/identity-access'
import { STOCKS_ROUTE_PATH, StocksPage } from '@domains/inventory'
import {
  PATIENT_DETAIL_ROUTE_PATH,
  PATIENTS_ROUTE_PATH,
  PatientDetailPage,
  PatientEvolutionPage,
  PatientPlansPage,
  PatientResumePage,
  PatientServiceHistoryPage,
  PatientsPage,
} from '@domains/patients'
import { PROFESSIONALS_ROUTE_PATH, ProfessionalsPage } from '@domains/professionals'
import { SCHEDULING_CALENDAR_ROUTE_PATH, SchedulingCalendarPage } from '@domains/scheduling'
import { LEGACY_TREATMENTS_ROUTE_PATH, SERVICES_ROUTE_PATH, ServicesPage } from '@domains/services'

function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route
          path={ANALYTICS_DASHBOARD_ROUTE_PATH}
          element={
            <ProtectedRoute requiredPermission={APP_PERMISSION_CODES.DASHBOARD_READ}>
              <AnalyticsDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={SCHEDULING_CALENDAR_ROUTE_PATH}
          element={
            <ProtectedRoute requiredPermission={APP_PERMISSION_CODES.CALENDAR_READ}>
              <SchedulingCalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATIENTS_ROUTE_PATH}
          element={
            <ProtectedRoute requiredPermission={APP_PERMISSION_CODES.PATIENTS_LIST_READ}>
              <PatientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={PATIENT_DETAIL_ROUTE_PATH}
          element={
            <ProtectedRoute requiredPermission={APP_PERMISSION_CODES.PATIENTS_READ}>
              <PatientDetailPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<PatientResumePage />} />
          <Route path="plans" element={<PatientPlansPage />} />
          <Route path="evolution" element={<PatientEvolutionPage />} />
          <Route path="history" element={<PatientServiceHistoryPage />} />
        </Route>
        <Route
          path={PROFESSIONALS_ROUTE_PATH}
          element={
            <ProtectedRoute requiredPermission={APP_PERMISSION_CODES.DOCTORS_LIST_READ}>
              <ProfessionalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={SERVICES_ROUTE_PATH}
          element={
            <ProtectedRoute
              requiredPermissions={[APP_PERMISSION_CODES.SERVICES_LIST_READ, APP_PERMISSION_CODES.TREATMENTS_LIST_READ]}
            >
              <ServicesPage />
            </ProtectedRoute>
          }
        />
        <Route path={LEGACY_TREATMENTS_ROUTE_PATH} element={<Navigate to={SERVICES_ROUTE_PATH} replace />} />
        <Route
          path={CENTER_MANAGEMENT_PROFILE_ROUTE_PATH}
          element={
            <ProtectedRoute requiredPermission={APP_PERMISSION_CODES.SETTINGS_READ}>
              <CenterManagementProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={STOCKS_ROUTE_PATH}
          element={
            <ProtectedRoute requiredPermission={APP_PERMISSION_CODES.STOCK_READ}>
              <StocksPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={DEFAULT_ROUTE} replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
