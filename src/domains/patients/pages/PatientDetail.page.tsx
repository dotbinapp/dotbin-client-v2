import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '@app/store/hooks'
import { APP_PERMISSION_CODES, selectSessionCenter, usePermissions } from '@domains/identity-access'
import { usePatientEditFlow } from '../application'
import { usePatientDetailQuery } from '../queries/patientDetail.query'
import { PatientCreateDialog } from '../ui/dialogs'
import { PatientDetailHeader, PatientDetailStats } from '../ui/sections'

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

  const patientDetailQuery = usePatientDetailQuery({
    canViewPatient: isAuthenticated && canViewPatient,
    centerId: center?.id,
    getAccessToken: getAccessTokenSilently,
    patientId,
  })

  return (
    <section className="flex flex-col gap-4">
      <PatientDetailHeader
        canEditPatient={canEditPatient}
        canViewPatient={canViewPatient}
        isError={patientDetailQuery.isError}
        isLoading={patientDetailQuery.isLoading}
        onEditProfile={() => setIsPatientDialogOpen(true)}
        patient={patientDetailQuery.data}
      />
      <PatientDetailStats patient={patientDetailQuery.data} />
      <PatientCreateDialog
        activePatient={patientDetailQuery.data ?? null}
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
