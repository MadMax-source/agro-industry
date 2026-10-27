import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/server/mongodb'
import { initializeDemoCatalog } from '@/lib/server/initialize-catalog'
import { CategoryModel, ProductModel } from '@/lib/server/models'
import { apiError } from '@/lib/server/http'

export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectToDatabase()
    await initializeDemoCatalog()
    const activeCategories = await CategoryModel.find({ isActive: true }).select({ id: 1 }).lean()
    const products = await ProductModel.find({
      status: 'published',
      categoryId: { $in: activeCategories.map((category) => category.id) },
    }).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ products })
  } catch (error) {
    return apiError(error)
  }
}
