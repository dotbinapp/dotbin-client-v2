import type { ChangeEvent, ComponentProps } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { formatCostInputWhileTyping, normalizeCostInput } from '@shared/utils'
import { Input } from '../atoms'

type InputProps = ComponentProps<typeof Input>
type HtmlFieldValue = string | number | readonly string[]
type ControlledInputFormat = 'cost'

interface ControlledInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>
  extends Omit<InputProps, 'defaultValue' | 'error' | 'name' | 'onBlur' | 'onChange' | 'ref' | 'value'> {
  control: Control<TFieldValues, unknown, TTransformedValues>
  format?: ControlledInputFormat
  name: TName
}

function getHtmlFieldValue(value: unknown): HtmlFieldValue {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string' || typeof value === 'number') return value
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string')

  return String(value)
}

function ControlledInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  control,
  format,
  name,
  ...inputProps
}: Readonly<ControlledInputProps<TFieldValues, TName, TTransformedValues>>) {
  const {
    field: { name: fieldName, onBlur, onChange, ref: inputRef, value },
    fieldState,
  } = useController<TFieldValues, TName, TTransformedValues>({ control, name })
  const isCostInput = format === 'cost'

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isCostInput) {
      onChange(event)
      return
    }

    onChange(formatCostInputWhileTyping(event.target.value))
  }

  const handleBlur = () => {
    if (isCostInput && typeof value === 'string') {
      onChange(normalizeCostInput(value))
    }

    onBlur()
  }

  return (
    <Input
      {...inputProps}
      error={fieldState.error?.message}
      inputMode={isCostInput ? 'decimal' : inputProps.inputMode}
      name={fieldName}
      onBlur={handleBlur}
      onChange={handleChange}
      ref={inputRef}
      type={isCostInput ? 'text' : inputProps.type}
      value={getHtmlFieldValue(value)}
    />
  )
}

export default ControlledInput
