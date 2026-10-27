/**
 * The WhatsApp number must use international format without a "+" sign, spaces,
 * or brackets.
 */
export const WHATSAPP_NUMBER = '2348131333796'

export const CONTACT_PHONE = '+234 813 133 3796'
export const CONTACT_EMAIL = 'Funalomenterprises@gmail.com'
export const BUSINESS_LOCATION = 'Abuja, Nigeria'

/** Products with stock at or below this number display as "Low Stock". */
export const LOW_STOCK_THRESHOLD = 50

/**
 * PROTOTYPE ONLY: demo admin credentials checked in the browser.
 * Client-side checks can always be bypassed — replace lib/admin-auth.ts with a
 * server-side provider before storing anything sensitive.
 */
export const DEMO_ADMIN_EMAIL = 'admin@funalom.demo'
export const DEMO_ADMIN_PASSWORD = 'funalom2026'

/** Bump when the persisted LocalStorage shape changes so data can be migrated. */
export const STORAGE_KEY = 'funalom-catalog'
export const STORAGE_VERSION = 1
