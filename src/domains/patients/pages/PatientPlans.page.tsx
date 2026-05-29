import { useOutletContext } from 'react-router-dom'
import { usePatientTreatmentPlansQuery } from '../queries/patientTreatmentPlans.query'
import { PatientActivePlans } from '../ui/sections'
import type { PatientDetailOutletContext } from './PatientDetail.page'

function PatientPlansPage() {
  const { canViewPatient, centerId, getAccessToken, patientId } = useOutletContext<PatientDetailOutletContext>()
  const treatmentPlansQuery = usePatientTreatmentPlansQuery({
    canViewPatient,
    centerId,
    getAccessToken,
    patientId,
  })

  return (
    <PatientActivePlans
      isError={treatmentPlansQuery.isError}
      isLoading={treatmentPlansQuery.isLoading}
      plans={treatmentPlansQuery.data}
    />
  )
}

export default PatientPlansPage
