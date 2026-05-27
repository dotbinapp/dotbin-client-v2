export function getProfessionalWhatsAppUrl(phone: string) {
  const phoneNumber = phone.replace(/\D/g, '')

  return `https://wa.me/${phoneNumber}`
}
