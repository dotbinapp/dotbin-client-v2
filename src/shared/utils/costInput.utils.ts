const COST_INPUT_LOCALE = 'es-AR'

const costInputFormatter = new Intl.NumberFormat(COST_INPUT_LOCALE, {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

const costInputTypingFormatter = new Intl.NumberFormat(COST_INPUT_LOCALE, {
  maximumFractionDigits: 0,
})

export function parseCostInput(rawValue: string): number | null {
  const trimmedValue = rawValue.trim().replace(/\s+/g, '').replace('$', '')
  if (!trimmedValue) return null

  const hasComma = trimmedValue.includes(',')
  const hasDot = trimmedValue.includes('.')
  let normalizedValue = trimmedValue

  if (hasComma) {
    normalizedValue = trimmedValue.replace(/\./g, '').replace(',', '.')
  } else if (hasDot) {
    const valueParts = trimmedValue.split('.')
    const looksLikeThousands = valueParts.length > 1 && valueParts.every((valuePart, index) => (index === 0 ? valuePart.length >= 1 && valuePart.length <= 3 : valuePart.length === 3))

    if (looksLikeThousands) {
      normalizedValue = valueParts.join('')
    }
  }

  const parsedValue = Number(normalizedValue)
  if (!Number.isFinite(parsedValue) || parsedValue < 0) return null

  return parsedValue
}

export function formatCostInput(value: number): string {
  return costInputFormatter.format(value)
}

export function formatCostInputWhileTyping(rawValue: string): string {
  const cleanedValue = rawValue.trim().replace(/\s+/g, '').replace('$', '').replace(/[^\d.,]/g, '')
  if (!cleanedValue) return ''

  const lastCommaIndex = cleanedValue.lastIndexOf(',')
  const lastDotIndex = cleanedValue.lastIndexOf('.')
  const decimalSeparatorIndex = Math.max(lastCommaIndex, lastDotIndex)
  const hasDecimalSeparator = decimalSeparatorIndex >= 0
  const decimalDigitsCount = hasDecimalSeparator ? cleanedValue.length - decimalSeparatorIndex - 1 : 0
  const shouldTreatLastSeparatorAsDecimal = hasDecimalSeparator && (decimalDigitsCount <= 2 || decimalDigitsCount === 0)

  if (shouldTreatLastSeparatorAsDecimal) {
    const integerDigits = cleanedValue.slice(0, decimalSeparatorIndex).replace(/\D/g, '')
    const decimalDigits = cleanedValue.slice(decimalSeparatorIndex + 1).replace(/\D/g, '').slice(0, 2)
    const formattedInteger = integerDigits ? costInputTypingFormatter.format(Number(integerDigits)) : '0'
    const shouldPreserveSeparator = decimalSeparatorIndex === cleanedValue.length - 1

    return shouldPreserveSeparator || decimalDigits.length > 0 ? `${formattedInteger},${decimalDigits}` : formattedInteger
  }

  const integerDigits = cleanedValue.replace(/\D/g, '')
  if (!integerDigits) return ''

  const parsedValue = Number(integerDigits)
  if (!Number.isFinite(parsedValue)) return ''

  return costInputTypingFormatter.format(parsedValue)
}

export function normalizeCostInput(rawValue: string): string {
  const parsedValue = parseCostInput(rawValue)
  if (parsedValue === null) return rawValue

  return formatCostInput(parsedValue)
}
