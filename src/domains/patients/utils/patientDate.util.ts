const PATIENT_DATE_FORMATTER = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const PATIENT_SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: 'short',
})

const PATIENT_VISIT_DATE_TIME_FORMATTER = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  month: 'short',
})

export function formatPatientDate(date: string | null) {
  if (!date) return '—'

  return PATIENT_SHORT_DATE_FORMATTER.format(new Date(date))
}

export function formatPatientNextVisit(date: string | null) {
  if (!date) return '—'

  return PATIENT_VISIT_DATE_TIME_FORMATTER.format(new Date(date))
}

export function formatPatientBirthDate(dateOfBirth: string | null) {
  if (!dateOfBirth) return '—'

  return PATIENT_DATE_FORMATTER.format(new Date(dateOfBirth))
}

export function calculatePatientAge(dateOfBirth: string | null) {
  if (!dateOfBirth) return '—'

  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const birthdayAlreadyHappened =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate())

  return `${birthdayAlreadyHappened ? age : age - 1} años`
}

export function getPatientInitials(fullName: string) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((namePart) => namePart.charAt(0).toUpperCase())
    .join('')
}

export function formatPatientDocumentNumber(documentNumber: string | null) {
  return documentNumber ? `DNI ${documentNumber}` : '—'
}
