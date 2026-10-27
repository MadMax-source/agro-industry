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
    const [products, categories, settings] = await Promise.all([
      ProductModel.find().sort({ updatedAt: -1 }).lean(),
      CategoryModel.find().sort({ displayOrder: 1, name: 1 }).lean(),
      BusinessSettingsModel.findOne({ id: 'business-settings' }).lean(),
    ])
    return NextResponse.json({ products, categories, settings })
  } catch (error) {
    return apiError(error)
  }
}
