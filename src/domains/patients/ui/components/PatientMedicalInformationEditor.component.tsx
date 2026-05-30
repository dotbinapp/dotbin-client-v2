import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Save, Trash2 } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { patientMedicalInformationSchema } from '@domains/patients/model'
import type { PatientMedicalInfo, PatientMedicalInformationFormInputValues, PatientMedicalInformationFormValues } from '@domains/patients/model'
import { Button, Text } from '@shared/ui/atoms'
import { ControlledInput, ControlledTextArea } from '@shared/ui/molecules'

interface PatientMedicalInformationEditorProps {
  disabled?: boolean
  formId: string
  medicalInfo: PatientMedicalInfo[]
  onCancel: () => void
  onValidSubmit: (patientMedicalInfo: PatientMedicalInfo[]) => Promise<void> | void
}

const EMPTY_MEDICAL_INFO_SECTION: PatientMedicalInfo = {
  information: '',
  title: '',
}

function getMedicalInformationFormValues(medicalInfo: PatientMedicalInfo[]): PatientMedicalInformationFormInputValues {
  return {
    patientMedicalInfo: medicalInfo.map((medicalInfoSection) => ({
      information: medicalInfoSection.information,
      title: medicalInfoSection.title,
    })),
  }
}

function PatientMedicalInformationEditor({ disabled = false, formId, medicalInfo, onCancel, onValidSubmit }: Readonly<PatientMedicalInformationEditorProps>) {
  const { control, handleSubmit, reset } = useForm<PatientMedicalInformationFormInputValues, unknown, PatientMedicalInformationFormValues>({
    defaultValues: getMedicalInformationFormValues(medicalInfo),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(patientMedicalInformationSchema),
  })
  const { append, fields: medicalInfoFields, remove } = useFieldArray({
    control,
    name: 'patientMedicalInfo',
  })

  useEffect(() => {
    reset(getMedicalInformationFormValues(medicalInfo))
  }, [medicalInfo, reset])

  const addMedicalInfoSection = () => {
    append({ ...EMPTY_MEDICAL_INFO_SECTION })
  }

  const saveMedicalInformation: SubmitHandler<PatientMedicalInformationFormValues> = async (medicalInformationDraft) => {
    await onValidSubmit(medicalInformationDraft.patientMedicalInfo)
  }

  return (
    <form className="flex flex-col gap-3" id={formId} onSubmit={handleSubmit(saveMedicalInformation)}>
      <div className="flex justify-end">
        <Button disabled={disabled} Icon={Plus} onClick={addMedicalInfoSection} size="sm" variant="secondary">
          Agregar sección
        </Button>
      </div>

      {medicalInfoFields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ui-border bg-ui-surface-muted px-4 py-8 text-center">
          <Text variant="body" tone="muted">Agregá una sección para cargar información médica.</Text>
        </div>
      ) : null}

      {medicalInfoFields.length > 0 ? (
        <div className="flex flex-col gap-3">
          {medicalInfoFields.map((medicalInfoField, medicalInfoIndex) => (
            <div className="relative rounded-2xl border border-ui-border bg-ui-surface p-3 shadow-[var(--theme-shadow-surface)]" key={medicalInfoField.id}>
              <Button
                aria-label={`Eliminar sección médica ${medicalInfoIndex + 1}`}
                className="absolute right-2 top-2"
                disabled={disabled}
                iconOnly
                Icon={Trash2}
                onClick={() => remove(medicalInfoIndex)}
                size="sm"
                variant="ghost"
              />

              <div className="grid gap-3 pr-9">
                <ControlledInput
                  control={control}
                  disabled={disabled}
                  label="Título"
                  name={`patientMedicalInfo.${medicalInfoIndex}.title`}
                  placeholder="Ej: Medicación, alergias, antecedentes"
                  required
                  size="compact"
                />
                <ControlledTextArea
                  control={control}
                  disabled={disabled}
                  label="Información"
                  name={`patientMedicalInfo.${medicalInfoIndex}.information`}
                  placeholder="Detalle médico relevante para el paciente"
                  required
                  size="compact"
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <Button disabled={disabled} onClick={onCancel} variant="ghost">
          Cancelar
        </Button>
        <Button disabled={disabled} Icon={Save} onLoading={disabled} type="submit">
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}

export default PatientMedicalInformationEditor
