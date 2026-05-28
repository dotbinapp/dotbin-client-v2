import type { ComponentProps } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { TextArea } from '../atoms'

type TextAreaProps = ComponentProps<typeof TextArea>

interface ControlledTextAreaProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>
  extends Omit<TextAreaProps, 'defaultValue' | 'error' | 'name' | 'onBlur' | 'onChange' | 'ref' | 'value'> {
  control: Control<TFieldValues, unknown, TTransformedValues>
  name: TName
}

function getTextAreaValue(value: unknown) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value

  return String(value)
}

function ControlledTextArea<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  control,
  name,
  ...textAreaProps
}: Readonly<ControlledTextAreaProps<TFieldValues, TName, TTransformedValues>>) {
  const {
    field: { name: fieldName, onBlur, onChange, ref: textAreaRef, value },
    fieldState,
  } = useController<TFieldValues, TName, TTransformedValues>({ control, name })

  return (
    <TextArea
      {...textAreaProps}
      error={fieldState.error?.message}
      name={fieldName}
      onBlur={onBlur}
      onChange={onChange}
      ref={textAreaRef}
      value={getTextAreaValue(value)}
    />
  )
}

export default ControlledTextArea
