import 'server-only'
import { z } from 'zod'

const optionalText = z.string().trim().optional()

export const productInputSchema = z.object({
  id: z.string().trim().min(1).optional(),
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortDescription: z.string().trim().min(10).max(200),
  description: z.string().trim().min(20),
  brand: z.string().trim().min(1).max(120),
  categoryId: z.string().trim().min(1),
  activeIngredient: optionalText,
  formulation: optionalText,
  manufacturer: optionalText,
  packSize: z.string().trim().min(1).max(100),
  price: z.number().finite().positive(),
  stock: z.number().int().min(0),
  sku: z.string().trim().min(1).max(100).optional(),
  images: z.array(z.string().url().or(z.string().startsWith('/'))).min(1).max(12),
  video: z.union([z.literal(''), z.string().url()]).optional(),
  usageInfo: z.string().trim().min(10),
  safetyInfo: optionalText,
  storageInfo: optionalText,
  featured: z.boolean(),
  status: z.enum(['published', 'draft']),
})

export const categoryInputSchema = z.object({
  id: z.string().trim().min(1).optional(),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(10),
  image: z.string().url().or(z.string().startsWith('/')).or(z.literal('')),
  isActive: z.boolean(),
  displayOrder: z.number().int().min(0),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(160).optional(),
})

export const settingsInputSchema = z.object({
  businessName: z.string().trim().min(1).max(160).optional(),
  tagline: z.string().trim().max(240).optional(),
  whatsappNumber: z.string().trim().max(40).optional(),
  contactPhone: z.string().trim().max(40).optional(),
  contactEmail: z.email().optional(),
  location: z.string().trim().max(300).optional(),
  address: z.string().trim().max(300).optional(),
  businessHours: z.string().trim().max(300).optional(),
  footerDescription: z.string().trim().max(1000).optional(),
  whatsappGreeting: z.string().trim().max(500).optional(),
  whatsappTemplate: z.string().trim().max(2000).optional(),
})

export const contactInputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(254),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(5).max(2000),
})

export const categoryDeletionSchema = z.object({
  strategy: z.discriminatedUnion('type', [
    z.object({ type: z.literal('unpublish') }),
    z.object({ type: z.literal('reassign'), targetCategoryId: z.string().trim().min(1) }),
  ]),
})
