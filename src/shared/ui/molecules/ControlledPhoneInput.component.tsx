import type { ReactNode } from 'react'
import { useId } from 'react'
import PhoneInput from 'react-phone-number-input'
import type { Value } from 'react-phone-number-input'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { useController } from 'react-hook-form'
import 'react-phone-number-input/style.css'
import { themeClass } from '../../styles/theme.styles'
import { composeClassName } from '../utils/className.utils'

interface ControlledPhoneInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> {
  control: Control<TFieldValues, unknown, TTransformedValues>
  disabled?: boolean
  helperText?: ReactNode
  label?: string
  name: TName
  required?: boolean
}

const PHONE_INPUT_CLASS =
  'phone-input-container min-h-11 rounded-lg border bg-ui-surface px-3 py-2.5 text-sm text-ui-text shadow-[var(--theme-shadow-surface)] transition-all focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20'
const SUPPORT_TEXT_CLASS = 'mt-1.5 text-xs font-medium'

function getPhoneInputValue(value: unknown): Value | undefined {
  return typeof value === 'string' && value ? (value as Value) : undefined
}

function ControlledPhoneInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  control,
  disabled = false,
  helperText,
  label,
  name,
  required = false,
}: Readonly<ControlledPhoneInputProps<TFieldValues, TName, TTransformedValues>>) {
  const generatedId = useId()
  const inputId = `${generatedId}-phone`
  const helperId = helperText ? `${inputId}-helper` : undefined
  const {
    field: { name: fieldName, onBlur, onChange, value },
    fieldState,
  } = useController<TFieldValues, TName, TTransformedValues>({ control, name })
  const errorId = fieldState.error ? `${inputId}-error` : undefined

  return (
    <div className="w-full">
      {label ? (
        <label className={`mb-1.5 block text-sm font-bold ${themeClass.text.default}`} htmlFor={inputId}>
          {label}
          {required ? <span className="ml-1 text-primary-600">*</span> : null}
        </label>
      ) : null}

      <PhoneInput
        aria-describedby={composeClassName(helperId, errorId) || undefined}
        aria-invalid={fieldState.error ? true : undefined}
        autoComplete="tel"
        className={composeClassName(
          PHONE_INPUT_CLASS,
          disabled && 'cursor-not-allowed border-ui-border bg-ui-surface-muted text-ui-text-subtle ring-0',
          fieldState.error ? 'phone-input-error border-red-300 bg-red-50/30 focus-within:border-red-400 focus-within:ring-red-500/25' : 'border-ui-border-strong',
        )}
        defaultCountry="AR"
        disabled={disabled}
        id={inputId}
        international
        name={fieldName}
        numberInputProps={{ inputMode: 'tel' }}
        onBlur={onBlur}
        onChange={(nextPhoneValue) => onChange(nextPhoneValue ?? '')}
        value={getPhoneInputValue(value)}
      />

      {helperText ? (
        <p className={composeClassName(SUPPORT_TEXT_CLASS, themeClass.text.muted)} id={helperId}>
          {helperText}
        </p>
      ) : null}
      {fieldState.error ? (
        <p className={composeClassName(SUPPORT_TEXT_CLASS, 'text-red-600')} id={errorId}>
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  )
}

export default ControlledPhoneInput
