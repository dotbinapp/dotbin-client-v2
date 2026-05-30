import { Activity, AlertTriangle, Baby, Ban, ClipboardList, FileText, HeartPulse, Pill, ShieldAlert, Stethoscope } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PatientMedicalInfoType } from '@domains/patients/model'

export const PATIENT_MEDICAL_INFO_FALLBACK_ICON = Stethoscope

export const PATIENT_MEDICAL_INFO_TYPE_ICON: Record<PatientMedicalInfoType, LucideIcon> = {
  Alergias: ShieldAlert,
  Medicamentos: Pill,
  Antecedentes: HeartPulse,
  Consideraciones: ClipboardList,
  Contraindicaciones: Ban,
  'Embarazo / lactancia': Baby,
  Hábitos: Activity,
  Observaciones: FileText,
}

export const PATIENT_MEDICAL_INFO_CUSTOM_TYPE_ICON = AlertTriangle
