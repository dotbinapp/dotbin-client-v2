import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useAppSelector } from '@app/store/hooks'
import { APP_PERMISSION_CODES, selectSessionCenter, usePermissions } from '@domains/identity-access'
import type { PatientDetail } from '@domains/patients/model'
import { usePatientEditFlow } from '../application'
import { usePatientDetailQuery } from '../queries/patientDetail.query'
import { PatientCreateDialog } from '../ui/dialogs'
import { PatientDetailHeader } from '../ui/sections'

export interface PatientDetailOutletContext {
  canViewPatient: boolean
  centerId?: string
  getAccessToken: () => Promise<string>
  patient?: PatientDetail
  patientId?: string
}

async function createPatientFromDetailPage() {
  return false
}

function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>()
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const center = useAppSelector(selectSessionCenter)
  const { hasPermission } = usePermissions()
  const canViewPatient = hasPermission(APP_PERMISSION_CODES.PATIENTS_READ)
  const canEditPatient = hasPermission(APP_PERMISSION_CODES.PATIENTS_ADMIN)
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false)
  const { isUpdatingPatient, updatePatient } = usePatientEditFlow({
    centerId: center?.id,
    getAccessToken: getAccessTokenSilently,
  })
  const canFetchPatient = Boolean(isAuthenticated && canViewPatient && center?.id && patientId)

  const patientDetailQuery = usePatientDetailQuery({
    canViewPatient: canFetchPatient,
    centerId: center?.id,
    getAccessToken: getAccessTokenSilently,
    patientId,
  })
  const patient = patientDetailQuery.data

  return (
    <section className="flex flex-col gap-4">
      <PatientDetailHeader
        canEditPatient={canEditPatient}
        canViewPatient={canViewPatient}
        isError={patientDetailQuery.isError}
        isLoading={patientDetailQuery.isLoading}
        onEditProfile={() => setIsPatientDialogOpen(true)}
        patient={patient}
      />

      {canFetchPatient && !patientDetailQuery.isError ? (
        <Outlet
          context={{
            canViewPatient: canFetchPatient,
            centerId: center?.id,
            getAccessToken: getAccessTokenSilently,
            patient,
            patientId,
          } satisfies PatientDetailOutletContext}
        />
      ) : null}

      <PatientCreateDialog
        activePatient={patient ?? null}
        isCreating={false}
        isOpen={isPatientDialogOpen}
        isUpdating={isUpdatingPatient}
        onClose={() => setIsPatientDialogOpen(false)}
        onCreatePatient={createPatientFromDetailPage}
        onUpdatePatient={updatePatient}
      />
    </section>
  )
}

export default PatientDetailPage
