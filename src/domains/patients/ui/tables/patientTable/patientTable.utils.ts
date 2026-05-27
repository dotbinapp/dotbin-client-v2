export function formatPatientVisitDate(lastVisitAt: string | null) {
  if (!lastVisitAt) return '—'

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(lastVisitAt))
}

export function getInstagramProfileUrl(instagramAccount: string) {
  return `https://instagram.com/${instagramAccount.replace('@', '')}`
}

export function getWhatsAppUrl(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, '')}`
}
