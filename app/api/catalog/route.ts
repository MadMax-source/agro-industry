import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/server/mongodb'
import { initializeDemoCatalog } from '@/lib/server/initialize-catalog'
import { BusinessSettingsModel, CategoryModel, ProductModel } from '@/lib/server/models'
import { apiError } from '@/lib/server/http'

export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectToDatabase()
    await initializeDemoCatalog()

    const [categories, settings] = await Promise.all([
      CategoryModel.find({ isActive: true }).sort({ displayOrder: 1, name: 1 }).lean(),
      BusinessSettingsModel.findOne({ id: 'business-settings' }).lean(),
    ])
    const products = await ProductModel.find({
      status: 'published',
      categoryId: { $in: categories.map((category) => category.id) },
    }).sort({ createdAt: -1 }).lean()

    if (!settings) return NextResponse.json({ error: 'Business settings were not found.' }, { status: 404 })
    return NextResponse.json({ products, categories, settings })
  } catch (error) {
    return apiError(error)
  }
}
