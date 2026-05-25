import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PageLoader, ProtectedRoute, RootRedirect } from '@src/app/components/routing'
import { DEFAULT_ROUTE } from '@src/app/router/route.constants'
import { ANALYTICS_DASHBOARD_ROUTE_PATH, AnalyticsDashboardPage } from '@src/domains/analytics/routes'
import { CENTER_MANAGEMENT_PROFILE_ROUTE_PATH, CenterManagementProfilePage } from '@src/domains/center-management/routes'
import { CLINICAL_SERVICES_TREATMENTS_ROUTE_PATH, ClinicalServicesTreatmentsPage } from '@src/domains/clinical-services/routes'
import { DOCTORS_ROUTE_PATH, DoctorsPage } from '@src/domains/doctors/routes'
import { APP_PERMISSION_CODES } from '@src/domains/identity-access'
import { PATIENTS_ROUTE_PATH, PatientsPage } from '@src/domains/patients/routes'
import { SCHEDULING_CALENDAR_ROUTE_PATH, SchedulingCalendarPage } from '@src/domains/scheduling/routes'
import { STOCKS_ROUTE_PATH, StocksPage } from '@src/domains/inventory/routes'

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
