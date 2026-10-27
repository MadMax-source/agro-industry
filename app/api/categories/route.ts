import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/server/mongodb'
import { initializeDemoCatalog } from '@/lib/server/initialize-catalog'
import { CategoryModel } from '@/lib/server/models'
import { apiError } from '@/lib/server/http'

export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectToDatabase()
    await initializeDemoCatalog()
    const categories = await CategoryModel.find({ isActive: true }).sort({ displayOrder: 1, name: 1 }).lean()
    return NextResponse.json({ categories })
  } catch (error) {
    return apiError(error)
  }
}
