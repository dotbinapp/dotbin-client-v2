import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { parseCostInput } from '@shared/utils'
import type { PatientCreatePayload, PatientTreatmentPlanCreatePayload } from './patient.types'

const INTEGER_PATTERN = /^\d+$/

const patientNameField = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `Ingresá ${fieldName}`)
    .min(2, `${fieldName} debe tener al menos 2 caracteres`)
    .max(80, `${fieldName} no puede superar 80 caracteres`)

const optionalNumericField = (fieldName: string, maxDigits: number, minDigits = 1) =>
  z
    .union([
      z.literal(''),
      z
        .string()
        .trim()
        .regex(/^\d+$/, `Ingresá ${fieldName} válido`)
        .min(minDigits, `${fieldName} debe tener al menos ${minDigits} dígitos`)
        .max(maxDigits, `${fieldName} no puede superar ${maxDigits} dígitos`)
        .transform(Number),
    ])
    .optional()
    .transform((value) => (value === '' ? undefined : value))

const optionalPhoneField = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .refine((value) => !value || isValidPhoneNumber(value), 'Ingresá un teléfono válido con código de país')
  .transform((value) => value || undefined)

const positiveIntegerInputField = (fieldName: string, maxValue: number) =>
  z
    .string()
    .trim()
    .min(1, `Ingresá ${fieldName}`)
    .regex(INTEGER_PATTERN, `Ingresá ${fieldName} válido`)
    .transform(Number)
    .refine((value) => value > 0, `${fieldName} debe ser mayor a 0`)
    .refine((value) => value <= maxValue, `${fieldName} no puede superar ${maxValue}`)

const moneyInputField = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `Ingresá ${fieldName}`)
    .refine((value) => parseCostInput(value) !== null, `Ingresá ${fieldName} válido`)
    .refine((value) => Number(parseCostInput(value)) >= 0, `${fieldName} no puede ser negativo`)

export const patientCreateSchema = z.object({
  dateOfBirth: z.string().trim().max(10, 'La fecha no es válida').optional().or(z.literal('')),
  documentNumber: optionalNumericField('un número de documento', 15),
  email: z.string().trim().email('Ingresá un email válido').optional().or(z.literal('')),
  firstName: patientNameField('el nombre'),
  gender: z.enum(['female', 'male', '']).optional(),
  instagramAccount: z.string().trim().max(30, 'Instagram no puede superar 30 caracteres').optional().or(z.literal('')),
  lastName: patientNameField('el apellido'),
  phone: optionalPhoneField,
})

const patientMedicalInfoSectionSchema = z.object({
  information: z.string().trim().min(1, 'Ingresá la información médica').max(1500, 'La información no puede superar 1500 caracteres'),
  title: z.string().trim().min(1, 'Seleccioná o ingresá un tipo').max(80, 'El tipo no puede superar 80 caracteres'),
})

export const patientMedicalInformationSchema = z.object({
  patientMedicalInfo: z.array(patientMedicalInfoSectionSchema),
})

export const patientTreatmentPlanCreateSchema = z
  .object({
    frequency: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'ANNUAL']),
    generateSessions: z.boolean(),
    notes: z.string().trim().max(1000, 'Las notas no pueden superar 1000 caracteres'),
    paidAmount: z.string().trim(),
    paymentStatus: z.enum(['unpaid', 'partial', 'paid']),
    professionalId: z.string().trim(),
    startDate: z.string().trim().min(1, 'Ingresá la fecha de inicio'),
    totalCost: moneyInputField('el costo total'),
    totalSessions: positiveIntegerInputField('la cantidad de sesiones', 100),
    treatmentIds: z.array(z.string().trim().min(1)).min(1, 'Seleccioná al menos un tratamiento'),
  })
  .superRefine((planDraft, context) => {
    const totalCost = parseCostInput(planDraft.totalCost)
    const paidAmount = parseCostInput(planDraft.paidAmount)

    if (planDraft.paymentStatus === 'partial' && paidAmount === null) {
      context.addIssue({
        code: 'custom',
        message: 'Ingresá un monto abonado válido',
        path: ['paidAmount'],
      })
    }

    if (planDraft.paymentStatus === 'partial' && paidAmount !== null && paidAmount <= 0) {
      context.addIssue({
        code: 'custom',
        message: 'El pago parcial debe ser mayor a 0',
        path: ['paidAmount'],
      })
    }

    if (planDraft.paymentStatus === 'partial' && paidAmount !== null && totalCost !== null && paidAmount > totalCost) {
      context.addIssue({
        code: 'custom',
        message: 'El monto abonado no puede superar el costo total',
        path: ['paidAmount'],
      })
    }
  })
  .transform<PatientTreatmentPlanCreatePayload>((planDraft) => ({
    frequency: planDraft.frequency,
    generateSessions: planDraft.generateSessions,
    notes: planDraft.notes || undefined,
    paidAmount: planDraft.paymentStatus === 'paid' ? Number(parseCostInput(planDraft.totalCost)) : Number(parseCostInput(planDraft.paidAmount) ?? 0),
    paymentStatus: planDraft.paymentStatus,
    professionalId: planDraft.professionalId || undefined,
    startDate: planDraft.startDate,
    totalCost: Number(parseCostInput(planDraft.totalCost)),
    totalSessions: planDraft.totalSessions,
    treatmentIds: planDraft.treatmentIds,
  }))

export type PatientCreateFormInputValues = z.input<typeof patientCreateSchema>
export type PatientCreateFormValues = PatientCreatePayload
export type PatientMedicalInformationFormInputValues = z.input<typeof patientMedicalInformationSchema>
export type PatientMedicalInformationFormValues = z.output<typeof patientMedicalInformationSchema>
export type PatientTreatmentPlanCreateFormInputValues = z.input<typeof patientTreatmentPlanCreateSchema>
export type PatientTreatmentPlanCreateFormValues = z.output<typeof patientTreatmentPlanCreateSchema>
