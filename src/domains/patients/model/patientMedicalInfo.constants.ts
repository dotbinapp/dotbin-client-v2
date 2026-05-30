export const PATIENT_MEDICAL_INFO_TYPES = [
  'Alergias',
  'Medicamentos',
  'Antecedentes',
  'Consideraciones',
  'Contraindicaciones',
  'Embarazo / lactancia',
  'Hábitos',
  'Observaciones',
] as const

export type PatientMedicalInfoType = (typeof PATIENT_MEDICAL_INFO_TYPES)[number]

const PATIENT_MEDICAL_INFO_TYPE_SET = new Set<string>(PATIENT_MEDICAL_INFO_TYPES)

export function isPatientMedicalInfoType(value: string): value is PatientMedicalInfoType {
  return PATIENT_MEDICAL_INFO_TYPE_SET.has(value)
}
