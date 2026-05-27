import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input'
import type { ProfessionalCreatePayload } from './professional.types'

const professionalNameField = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `Ingresá ${fieldName}`)
    .min(2, `${fieldName} debe tener al menos 2 caracteres`)
    .max(80, `${fieldName} no puede superar 80 caracteres`)

const optionalTextField = (fieldName: string, maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `${fieldName} no puede superar ${maxLength} caracteres`)
    .optional()
    .or(z.literal(''))
    .transform((value) => value || undefined)

const optionalEmailField = z
  .string()
  .trim()
  .email('Ingresá un email válido')
  .optional()
  .or(z.literal(''))
  .transform((value) => value || undefined)

const optionalPhoneField = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .refine((value) => !value || isValidPhoneNumber(value), 'Ingresá un teléfono válido con código de país')
  .transform((value) => value || undefined)

export const professionalCreateSchema = z.object({
  email: optionalEmailField,
  firstName: professionalNameField('el nombre'),
  lastName: professionalNameField('el apellido'),
  phone: optionalPhoneField,
  specialty: optionalTextField('Especialidad', 120),
})

export type ProfessionalCreateFormInputValues = z.input<typeof professionalCreateSchema>
export type ProfessionalCreateFormValues = ProfessionalCreatePayload
