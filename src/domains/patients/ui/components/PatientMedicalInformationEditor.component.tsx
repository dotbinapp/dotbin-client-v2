import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Save, Trash2 } from 'lucide-react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { isPatientMedicalInfoType, PATIENT_MEDICAL_INFO_TYPES, patientMedicalInformationSchema } from '@domains/patients/model'
import type { PatientMedicalInfo, PatientMedicalInformationFormInputValues, PatientMedicalInformationFormValues } from '@domains/patients/model'
import { Button, Text } from '@shared/ui/atoms'
import { ControlledInput, ControlledTextArea } from '@shared/ui/molecules'
import { composeClassName } from '@shared/ui/utils/className.utils'
import { PATIENT_MEDICAL_INFO_CUSTOM_TYPE_ICON, PATIENT_MEDICAL_INFO_TYPE_ICON } from './patientMedicalInformationIcon.constants'

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
  const [customTypeFieldIds, setCustomTypeFieldIds] = useState<ReadonlySet<string>>(() => new Set())
  const { control, formState, handleSubmit, reset, setValue } = useForm<PatientMedicalInformationFormInputValues, unknown, PatientMedicalInformationFormValues>({
    defaultValues: getMedicalInformationFormValues(medicalInfo),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    resolver: zodResolver(patientMedicalInformationSchema),
  })
  const { append, fields: medicalInfoFields, remove } = useFieldArray({
    control,
    name: 'patientMedicalInfo',
  })
  const watchedMedicalInfo = useWatch({
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

  const selectPredefinedType = (medicalInfoIndex: number, medicalInfoFieldId: string, medicalInfoType: string) => {
    setCustomTypeFieldIds((currentCustomTypeFieldIds) => {
      const nextCustomTypeFieldIds = new Set(currentCustomTypeFieldIds)
      nextCustomTypeFieldIds.delete(medicalInfoFieldId)
      return nextCustomTypeFieldIds
    })
    setValue(`patientMedicalInfo.${medicalInfoIndex}.title`, medicalInfoType, { shouldDirty: true, shouldValidate: true })
  }

  const selectCustomType = (medicalInfoIndex: number, medicalInfoFieldId: string, currentTitle: string) => {
    setCustomTypeFieldIds((currentCustomTypeFieldIds) => new Set(currentCustomTypeFieldIds).add(medicalInfoFieldId))

    if (isPatientMedicalInfoType(currentTitle)) {
      setValue(`patientMedicalInfo.${medicalInfoIndex}.title`, '', { shouldDirty: true, shouldValidate: true })
    }
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
        <div className="flex flex-col gap-2">
          {medicalInfoFields.map((medicalInfoField, medicalInfoIndex) => (
            <div className="relative rounded-2xl border border-ui-border bg-ui-surface p-2.5 shadow-[var(--theme-shadow-surface)]" key={medicalInfoField.id}>
              <Button
                aria-label={`Eliminar sección médica ${medicalInfoIndex + 1}`}
                className="absolute right-2 top-2 size-8"
                disabled={disabled}
                iconOnly
                Icon={Trash2}
                onClick={() => remove(medicalInfoIndex)}
                size="sm"
                variant="ghost"
              />

              <div className="grid gap-2 pr-9">
                <div>
                  <Text as="p" variant="caption" className="mb-1.5 font-bold">Tipo <span className="text-primary-600 dark:text-primary-300">*</span></Text>
                  <div aria-label="Tipo de información médica" className="flex flex-wrap gap-1.5" role="radiogroup">
                    {PATIENT_MEDICAL_INFO_TYPES.map((medicalInfoType) => {
                      const Icon = PATIENT_MEDICAL_INFO_TYPE_ICON[medicalInfoType]
                      const isSelectedType = watchedMedicalInfo?.[medicalInfoIndex]?.title === medicalInfoType

                      return (
                        <button
                          aria-checked={isSelectedType}
                          className={composeClassName(
                            'inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50',
                            isSelectedType
                              ? 'border-primary-500 bg-ui-primary-soft text-ui-primary-text shadow-sm'
                              : 'border-ui-border bg-ui-surface-muted text-ui-text-muted hover:border-primary-300 hover:text-ui-primary-text',
                          )}
                          disabled={disabled}
                          key={medicalInfoType}
                          onClick={() => selectPredefinedType(medicalInfoIndex, medicalInfoField.id, medicalInfoType)}
                          role="radio"
                          type="button"
                        >
                          <Icon aria-hidden="true" size={13} />
                          {medicalInfoType}
                        </button>
                      )
                    })}

                    <button
                      aria-checked={customTypeFieldIds.has(medicalInfoField.id) || Boolean(watchedMedicalInfo?.[medicalInfoIndex]?.title && !isPatientMedicalInfoType(watchedMedicalInfo[medicalInfoIndex].title))}
                      className={composeClassName(
                        'inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50',
                        customTypeFieldIds.has(medicalInfoField.id) || Boolean(watchedMedicalInfo?.[medicalInfoIndex]?.title && !isPatientMedicalInfoType(watchedMedicalInfo[medicalInfoIndex].title))
                          ? 'border-primary-500 bg-ui-primary-soft text-ui-primary-text shadow-sm'
                          : 'border-ui-border bg-ui-surface-muted text-ui-text-muted hover:border-primary-300 hover:text-ui-primary-text',
                      )}
                      disabled={disabled}
                      onClick={() => selectCustomType(medicalInfoIndex, medicalInfoField.id, watchedMedicalInfo?.[medicalInfoIndex]?.title ?? '')}
                      role="radio"
                      type="button"
                    >
                      <PATIENT_MEDICAL_INFO_CUSTOM_TYPE_ICON aria-hidden="true" size={13} />
                      Otro
                    </button>
                  </div>

                  {formState.errors.patientMedicalInfo?.[medicalInfoIndex]?.title?.message ? (
                    <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-300">{formState.errors.patientMedicalInfo[medicalInfoIndex]?.title?.message}</p>
                  ) : null}
                </div>

                {customTypeFieldIds.has(medicalInfoField.id) || Boolean(watchedMedicalInfo?.[medicalInfoIndex]?.title && !isPatientMedicalInfoType(watchedMedicalInfo[medicalInfoIndex].title)) ? (
                  <ControlledInput
                    control={control}
                    disabled={disabled}
                    label="Tipo personalizado"
                    name={`patientMedicalInfo.${medicalInfoIndex}.title`}
                    placeholder="Ej: Marcapasos, diabetes, fotosensibilidad"
                    required
                    size="compact"
                  />
                ) : null}

                <ControlledTextArea
                  className="[min-height:5.5rem] resize-none"
                  control={control}
                  disabled={disabled}
                  label="Descripción"
                  name={`patientMedicalInfo.${medicalInfoIndex}.information`}
                  placeholder="Detalle médico relevante"
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
