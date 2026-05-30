import { useOutletContext } from 'react-router-dom'
import { usePatientMedicalInfoFlow } from '../application'
import type { PatientMedicalInfo } from '../model'
import { usePatientTreatmentPlansQuery } from '../queries/patientTreatmentPlans.query'
import { PatientActivePlans, PatientDetailStats, PatientMedicalInformation } from '../ui/sections'
import type { PatientDetailOutletContext } from './PatientDetail.page'

function PatientResumePage() {
  const { canEditPatient, canViewPatient, centerId, getAccessToken, isPatientLoading, patient, patientId } = useOutletContext<PatientDetailOutletContext>()
  const treatmentPlansQuery = usePatientTreatmentPlansQuery({
    canViewPatient,
    centerId,
    getAccessToken,
    patientId,
  })
  const { isUpdatingMedicalInfo, updatePatientMedicalInfo } = usePatientMedicalInfoFlow({
    centerId,
    getAccessToken,
  })

  const savePatientMedicalInfo = (patientMedicalInfo: PatientMedicalInfo[]) => {
    if (!patientId) return Promise.resolve(false)

    return updatePatientMedicalInfo(patientId, patientMedicalInfo)
  }

  return (
    <>
      <PatientDetailStats isLoading={isPatientLoading} patient={patient} />

      <section className="flex flex-col items-start gap-4 lg:flex-row">
        <PatientMedicalInformation
          canEditPatient={canEditPatient}
          isLoading={isPatientLoading}
          isSaving={isUpdatingMedicalInfo}
          medicalInfo={patient?.patientMedicalInfo}
          onSave={savePatientMedicalInfo}
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
