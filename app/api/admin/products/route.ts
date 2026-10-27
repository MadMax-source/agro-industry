import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/server/mongodb'
import { CategoryModel, ProductModel } from '@/lib/server/models'
import { apiError } from '@/lib/server/http'
import { productInputSchema } from '@/lib/server/validation'
import { Types } from 'mongoose'

export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectToDatabase()
    const products = await ProductModel.find().sort({ updatedAt: -1 }).lean()
    return NextResponse.json({ products })
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const input = productInputSchema.parse(await request.json())
    const category = await CategoryModel.findOne({ id: input.categoryId }).lean()
    if (!category) return NextResponse.json({ error: 'The selected category does not exist.' }, { status: 400 })
    if (input.status === 'published' && !category.isActive) {
      return NextResponse.json({ error: 'Activate the category before publishing this product.' }, { status: 400 })
    }

    const product = await ProductModel.create({ ...input, id: input.id ?? new Types.ObjectId().toString() })
    return NextResponse.json({ product: product.toJSON() }, { status: 201 })
  } catch (error) {
    return apiError(error)
  }
}
