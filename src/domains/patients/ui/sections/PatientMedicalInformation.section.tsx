import { useState } from 'react'
import { Pencil } from 'lucide-react'
import type { PatientMedicalInfo } from '@domains/patients/model'
import { Button, Text } from '@shared/ui/atoms'
import { AsyncSectionContainer } from '@shared/ui/layout'
import { PatientMedicalInformationEditor } from '../components'

interface PatientMedicalInformationProps {
  canEditPatient?: boolean
  isLoading?: boolean
  isSaving?: boolean
  medicalInfo?: PatientMedicalInfo[]
  onSave: (patientMedicalInfo: PatientMedicalInfo[]) => Promise<boolean>
}

const PATIENT_MEDICAL_INFORMATION_FORM_ID = 'patient-medical-information-form'

function PatientMedicalInformation({ canEditPatient = false, isLoading = false, isSaving = false, medicalInfo = [], onSave }: Readonly<PatientMedicalInformationProps>) {
  const [isEditingMedicalInfo, setIsEditingMedicalInfo] = useState(false)

  const savePatientMedicalInfo = async (patientMedicalInfo: PatientMedicalInfo[]) => {
    const medicalInfoWasSaved = await onSave(patientMedicalInfo)
    if (medicalInfoWasSaved) setIsEditingMedicalInfo(false)
  }

  return (
    <AsyncSectionContainer
      id="informacion-medica"
      surface="solid"
      radius="xl"
      className="scroll-mt-6 p-0! flex-1"
      isLoading={isLoading}
    >
      <div className="flex flex-col gap-3 p-4 pb-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <Text as="h2" variant="label" className="text-base">Información médica</Text>
            <Text variant="caption" tone="muted">Medicamentos, alergias, antecedentes y alertas clínicas.</Text>
          </div>

          {canEditPatient && !isEditingMedicalInfo ? (
            <Button disabled={isSaving} Icon={Pencil} onClick={() => setIsEditingMedicalInfo(true)} size="sm" variant="secondary">
              Editar
            </Button>
          ) : null}
        </div>
      </div>

      <div className="px-3 py-2">
        {isEditingMedicalInfo ? (
          <PatientMedicalInformationEditor
            disabled={isSaving}
            formId={PATIENT_MEDICAL_INFORMATION_FORM_ID}
            medicalInfo={medicalInfo}
            onCancel={() => setIsEditingMedicalInfo(false)}
            onValidSubmit={savePatientMedicalInfo}
          />
        ) : null}

        {!isEditingMedicalInfo && medicalInfo.length === 0 ? (
          <div className="px-2 py-6 text-center">
            <Text variant="body" tone="muted">No hay información médica registrada.</Text>
          </div>
        ) : null}

        {!isEditingMedicalInfo && medicalInfo.length > 0 ? (
          <div className="flex flex-col gap-2">
            {medicalInfo.map((medicalInfoSection, medicalInfoIndex) => (
              <article className="rounded-2xl border border-ui-border bg-ui-surface px-4 py-3" key={`${medicalInfoSection.title}-${medicalInfoIndex}`}>
                <Text as="h3" variant="label" className="text-sm">{medicalInfoSection.title}</Text>
                <Text variant="body" className="mt-1 whitespace-pre-line">{medicalInfoSection.information}</Text>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </AsyncSectionContainer>
  )
}

export default PatientMedicalInformation
