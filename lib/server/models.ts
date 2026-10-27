import 'server-only'
import { model, models, Schema } from 'mongoose'

const timestamps = { timestamps: true, versionKey: false as const }

const categorySchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  timestamps,
)

const productSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true, trim: true },
    categoryId: { type: String, required: true, index: true },
    activeIngredient: { type: String },
    formulation: { type: String },
    manufacturer: { type: String },
    packSize: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    sku: { type: String, sparse: true, unique: true, trim: true },
    images: { type: [String], default: [] },
    video: { type: String },
    usageInfo: { type: String, required: true },
    safetyInfo: { type: String },
    storageInfo: { type: String },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  },
  timestamps,
)

const businessSettingsSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, default: 'business-settings' },
    businessName: { type: String, required: true },
    tagline: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    businessHours: { type: String, required: true },
    footerDescription: { type: String, required: true },
    whatsappGreeting: { type: String, required: true },
    whatsappTemplate: { type: String, required: true },
  },
  timestamps,
)

const catalogMetaSchema = new Schema(
  { _id: { type: String }, initializedAt: { type: Date, required: true } },
  { versionKey: false },
)

export const CategoryModel = models.Category ?? model('Category', categorySchema)
export const ProductModel = models.Product ?? model('Product', productSchema)
export const BusinessSettingsModel = models.BusinessSettings ?? model('BusinessSettings', businessSettingsSchema)
export const CatalogMetaModel = models.CatalogMeta ?? model('CatalogMeta', catalogMetaSchema)
