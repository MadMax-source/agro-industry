import type { BusinessSettings, Product } from '@/types'
import { formatNaira } from '@/lib/catalog'

const VALID_NUMBER = /^[1-9]\d{7,14}$/

export function isValidWhatsAppNumber(value: string | undefined | null): value is string {
  return !!value && VALID_NUMBER.test(value)
}

/** Replaces only known {placeholders}; unknown tokens are left untouched. */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match,
  )
}

function buildUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function buildOrderMessage(
  settings: BusinessSettings,
  product: Product,
  quantity: number,
  productUrl: string,
): string {
  return fillTemplate(settings.whatsappTemplate, {
    businessName: settings.businessName,
    productName: product.name,
    quantity: String(quantity),
    price: formatNaira(product.price),
    subtotal: formatNaira(product.price * quantity),
    productUrl,
    packSize: product.packSize,
  })
}

/** Returns null when the WhatsApp number has not been configured correctly. */
export function buildOrderUrl(
  settings: BusinessSettings,
  product: Product,
  quantity: number,
  productUrl: string,
): string | null {
  if (!isValidWhatsAppNumber(settings.whatsappNumber)) return null
  return buildUrl(settings.whatsappNumber, buildOrderMessage(settings, product, quantity, productUrl))
}

export function buildChatUrl(settings: BusinessSettings, message?: string): string | null {
  if (!isValidWhatsAppNumber(settings.whatsappNumber)) return null
  const text = message ?? fillTemplate(settings.whatsappGreeting, { businessName: settings.businessName })
  return buildUrl(settings.whatsappNumber, text)
}
