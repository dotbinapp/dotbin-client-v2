import { useOutletContext } from 'react-router-dom'
import { usePatientTreatmentPlansQuery } from '../queries/patientTreatmentPlans.query'
import { PatientActivePlans, PatientDetailStats } from '../ui/sections'
import type { PatientDetailOutletContext } from './PatientDetail.page'

function PatientResumePage() {
  const { canViewPatient, centerId, getAccessToken, patient, patientId } = useOutletContext<PatientDetailOutletContext>()
  const treatmentPlansQuery = usePatientTreatmentPlansQuery({
    canViewPatient,
    centerId,
    getAccessToken,
    patientId,
  })

  return (
    <>
      <PatientDetailStats patient={patient} />

      <section className="flex gap-4">
        <PatientActivePlans
          isError={treatmentPlansQuery.isError}
          isLoading={treatmentPlansQuery.isLoading}
          plans={treatmentPlansQuery.data}
        />

        <PatientActivePlans
          isError={treatmentPlansQuery.isError}
          isLoading={treatmentPlansQuery.isLoading}
          plans={treatmentPlansQuery.data}
        />
      </section>
    </>
  )
}

export default PatientResumePage
