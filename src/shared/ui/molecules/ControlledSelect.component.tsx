import type { ComponentProps } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { Select } from '../atoms'

type SelectProps = ComponentProps<typeof Select>
type HtmlFieldValue = string | number | readonly string[]

interface ControlledSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>
  extends Omit<SelectProps, 'defaultValue' | 'error' | 'name' | 'onBlur' | 'onChange' | 'ref' | 'value'> {
  control: Control<TFieldValues, unknown, TTransformedValues>
  name: TName
}

function getHtmlFieldValue(value: unknown): HtmlFieldValue {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string' || typeof value === 'number') return value
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string')

  return String(value)
}

function ControlledSelect<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  control,
  name,
  ...selectProps
}: Readonly<ControlledSelectProps<TFieldValues, TName, TTransformedValues>>) {
  const {
    field: { name: fieldName, onBlur, onChange, ref: selectRef, value },
    fieldState,
  } = useController<TFieldValues, TName, TTransformedValues>({ control, name })

  return (
    <Select
      {...selectProps}
      error={fieldState.error?.message}
      name={fieldName}
      onBlur={onBlur}
      onChange={onChange}
      ref={selectRef}
      value={getHtmlFieldValue(value)}
    />
  )
}

export default ControlledSelect
