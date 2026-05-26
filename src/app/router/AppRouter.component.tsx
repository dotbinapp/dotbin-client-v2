import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PageLoader, ProtectedRoute, RootRedirect } from '@app/components/routing'
import { DEFAULT_ROUTE } from '@app/router/route.constants'
import { ANALYTICS_DASHBOARD_ROUTE_PATH, AnalyticsDashboardPage } from '@domains/analytics'
import { CENTER_MANAGEMENT_PROFILE_ROUTE_PATH, CenterManagementProfilePage } from '@domains/center-management'
import { CLINICAL_SERVICES_TREATMENTS_ROUTE_PATH, ClinicalServicesTreatmentsPage } from '@domains/clinical-services'
import { DOCTORS_ROUTE_PATH, DoctorsPage } from '@domains/doctors'
import { APP_PERMISSION_CODES } from '@domains/identity-access'
import { STOCKS_ROUTE_PATH, StocksPage } from '@domains/inventory'
import { PATIENTS_ROUTE_PATH, PatientsPage } from '@domains/patients'
import { SCHEDULING_CALENDAR_ROUTE_PATH, SchedulingCalendarPage } from '@domains/scheduling'

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
          path={DOCTORS_ROUTE_PATH}
          element={
            <ProtectedRoute requiredPermission={APP_PERMISSION_CODES.DOCTORS_LIST_READ}>
              <DoctorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={CLINICAL_SERVICES_TREATMENTS_ROUTE_PATH}
          element={
            <ProtectedRoute requiredPermission={APP_PERMISSION_CODES.TREATMENTS_LIST_READ}>
              <ClinicalServicesTreatmentsPage />
            </ProtectedRoute>
          }
        />
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
