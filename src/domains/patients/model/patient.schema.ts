import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input'
import type { PatientCreatePayload } from './patient.types'

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

export type PatientCreateFormInputValues = z.input<typeof patientCreateSchema>
export type PatientCreateFormValues = PatientCreatePayload
