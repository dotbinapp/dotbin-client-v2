import type { ComponentProps } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { Input } from '../atoms'

type InputProps = ComponentProps<typeof Input>
type HtmlFieldValue = string | number | readonly string[]

interface ControlledInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>
  extends Omit<InputProps, 'defaultValue' | 'error' | 'name' | 'onBlur' | 'onChange' | 'ref' | 'value'> {
  control: Control<TFieldValues, unknown, TTransformedValues>
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
  name,
  ...inputProps
}: Readonly<ControlledInputProps<TFieldValues, TName, TTransformedValues>>) {
  const {
    field: { name: fieldName, onBlur, onChange, ref: inputRef, value },
    fieldState,
  } = useController<TFieldValues, TName, TTransformedValues>({ control, name })

  return (
    <Input
      {...inputProps}
      error={fieldState.error?.message}
      name={fieldName}
      onBlur={onBlur}
      onChange={onChange}
      ref={inputRef}
      value={getHtmlFieldValue(value)}
    />
  )
}

export default ControlledInput
