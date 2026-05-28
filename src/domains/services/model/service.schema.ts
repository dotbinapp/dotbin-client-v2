import { z } from 'zod'
import { parseCostInput } from '@shared/utils'
import type { ServiceCreatePayload } from './service.types'

const INTEGER_PATTERN = /^\d+$/

const serviceNameField = z
  .string()
  .trim()
  .min(1, 'Ingresá el nombre del servicio')
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(120, 'El nombre no puede superar 120 caracteres')

const optionalTextField = (fieldName: string, maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `${fieldName} no puede superar ${maxLength} caracteres`)

const moneyInputField = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `Ingresá ${fieldName}`)
    .refine((value) => parseCostInput(value) !== null, `Ingresá ${fieldName} válido`)
    .refine((value) => Number(parseCostInput(value)) > 0, `${fieldName} debe ser mayor a 0`)

const durationInputField = z
  .string()
  .trim()
  .min(1, 'Ingresá la duración')
  .regex(INTEGER_PATTERN, 'Ingresá una duración válida')
  .transform(Number)
  .refine((value) => value > 0, 'La duración debe ser mayor a 0')
  .refine((value) => value <= 1440, 'La duración no puede superar 1440 minutos')

export const serviceCreateSchema = z
  .object({
    cost: moneyInputField('un costo'),
    depositAmount: z.string().trim(),
    description: optionalTextField('La descripción', 300),
    durationMinutes: durationInputField,
    hasPostServiceInstructions: z.boolean(),
    name: serviceNameField,
    postServiceInstructions: optionalTextField('Las indicaciones post-servicio', 800),
    requiresDeposit: z.boolean(),
  })
  .superRefine((serviceDraft, context) => {
    const parsedDepositAmount = parseCostInput(serviceDraft.depositAmount)

    if (serviceDraft.requiresDeposit && parsedDepositAmount === null) {
      context.addIssue({
        code: 'custom',
        message: 'Ingresá una seña válida',
        path: ['depositAmount'],
      })
    }

    if (serviceDraft.requiresDeposit && parsedDepositAmount !== null && parsedDepositAmount <= 0) {
      context.addIssue({
        code: 'custom',
        message: 'La seña debe ser mayor a 0',
        path: ['depositAmount'],
      })
    }

    if (serviceDraft.hasPostServiceInstructions && !serviceDraft.postServiceInstructions.trim()) {
      context.addIssue({
        code: 'custom',
        message: 'Ingresá las indicaciones post-servicio',
        path: ['postServiceInstructions'],
      })
    }
  })
  .transform<ServiceCreatePayload>((serviceDraft) => ({
    cost: Number(parseCostInput(serviceDraft.cost)),
    depositAmount: serviceDraft.requiresDeposit ? Number(parseCostInput(serviceDraft.depositAmount)) : undefined,
    description: serviceDraft.description || undefined,
    durationMinutes: serviceDraft.durationMinutes,
    name: serviceDraft.name,
    postServiceInstructions: serviceDraft.hasPostServiceInstructions ? serviceDraft.postServiceInstructions : undefined,
    requiresDeposit: serviceDraft.requiresDeposit,
  }))

export type ServiceCreateFormInputValues = z.input<typeof serviceCreateSchema>
export type ServiceCreateFormValues = z.output<typeof serviceCreateSchema>
