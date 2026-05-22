type ClassNameValue = string | false | null | undefined

export function composeClassName(...classNames: ClassNameValue[]) {
  return classNames.filter(Boolean).join(' ')
}
