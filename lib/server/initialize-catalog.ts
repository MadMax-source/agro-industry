import 'server-only'
import { seedCategories, seedProducts, seedSettings } from '@/lib/data/seed'
import { BusinessSettingsModel, CatalogMetaModel, CategoryModel, ProductModel } from '@/lib/server/models'

async function migrateLegacyBusinessContactSettings() {
  const migrationId = 'business-contact-details-abuja'
  const claim = await CatalogMetaModel.updateOne(
    { _id: migrationId },
    { $setOnInsert: { initializedAt: new Date() } },
    { upsert: true },
  )
  if (claim.upsertedCount !== 1) return

  try {
    await Promise.all([
      BusinessSettingsModel.updateOne(
        { id: 'business-settings', whatsappNumber: '2348000000000' },
        { $set: { whatsappNumber: seedSettings.whatsappNumber } },
      ),
      BusinessSettingsModel.updateOne(
        { id: 'business-settings', contactPhone: '+234 800 000 0000' },
        { $set: { contactPhone: seedSettings.contactPhone } },
      ),
      BusinessSettingsModel.updateOne(
        { id: 'business-settings', contactEmail: 'info@funalomenterprises.com' },
        { $set: { contactEmail: seedSettings.contactEmail } },
      ),
      BusinessSettingsModel.updateOne(
        { id: 'business-settings', location: 'Lagos, Nigeria' },
        { $set: { location: seedSettings.location } },
      ),
      BusinessSettingsModel.updateOne(
        { id: 'business-settings', address: 'Lagos, Nigeria' },
        { $set: { address: seedSettings.address } },
      ),
      BusinessSettingsModel.updateOne(
        {
          id: 'business-settings',
          footerDescription:
            'Quality agricultural inputs, crop protection solutions, and farm essentials for farmers and agribusinesses in Lagos and beyond.',
        },
        { $set: { footerDescription: seedSettings.footerDescription } },
      ),
    ])
  } catch (error) {
    await CatalogMetaModel.deleteOne({ _id: migrationId })
    throw error
  }
}

async function migrateLegacyBusinessName() {
  const migrationId = 'business-name-the-funalom-enterprise'
  const claim = await CatalogMetaModel.updateOne(
    { _id: migrationId },
    { $setOnInsert: { initializedAt: new Date() } },
    { upsert: true },
  )
  if (claim.upsertedCount !== 1) return

  try {
    await BusinessSettingsModel.updateOne(
      { id: 'business-settings', businessName: 'Funalom Enterprises' },
      { $set: { businessName: seedSettings.businessName } },
    )
  } catch (error) {
    await CatalogMetaModel.deleteOne({ _id: migrationId })
    throw error
  }
}

export async function initializeDemoCatalog() {
  await migrateLegacyBusinessContactSettings()
  await migrateLegacyBusinessName()

  const existing = await CatalogMetaModel.findById('catalog-initialized').lean()
  if (existing) return

  const claim = await CatalogMetaModel.updateOne(
    { _id: 'catalog-initialized' },
    { $setOnInsert: { initializedAt: new Date() } },
    { upsert: true },
  )
  if (claim.upsertedCount !== 1) return

  try {
    const [categoryCount, productCount] = await Promise.all([
      CategoryModel.countDocuments(),
      ProductModel.countDocuments(),
    ])

    if (categoryCount === 0 && productCount === 0) {
      await CategoryModel.insertMany(seedCategories)
    }

    const seededCategoryCount = await CategoryModel.countDocuments({
      id: { $in: seedCategories.map((category) => category.id) },
    })
    if (productCount === 0 && seededCategoryCount === seedCategories.length) {
      await ProductModel.insertMany(seedProducts)
    }

    await BusinessSettingsModel.updateOne(
      { id: 'business-settings' },
      { $setOnInsert: { ...seedSettings, id: 'business-settings' } },
      { upsert: true },
    )
  } catch (error) {
    await CatalogMetaModel.deleteOne({ _id: 'catalog-initialized' })
    throw error
  }
}
