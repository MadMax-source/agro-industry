import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/server/mongodb'
import { CategoryModel, ProductModel } from '@/lib/server/models'
import { apiError } from '@/lib/server/http'
import { productInputSchema } from '@/lib/server/validation'

export const runtime = 'nodejs'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await connectToDatabase()
    const { id } = await params
    const product = await ProductModel.findOne({ id }).lean()
    if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
    return NextResponse.json({ product })
  } catch (error) {
    return apiError(error)
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    await connectToDatabase()
    const { id } = await params
    const input = productInputSchema.parse(await request.json())
    const category = await CategoryModel.findOne({ id: input.categoryId }).lean()
    if (!category) return NextResponse.json({ error: 'The selected category does not exist.' }, { status: 400 })
    if (input.status === 'published' && !category.isActive) {
      return NextResponse.json({ error: 'Activate the category before publishing this product.' }, { status: 400 })
    }

    const product = await ProductModel.findOneAndUpdate(
      { id },
      { ...input, id },
      { new: true, runValidators: true },
    ).lean()
    if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
    return NextResponse.json({ product })
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await connectToDatabase()
    const { id } = await params
    const product = await ProductModel.findOneAndDelete({ id }).lean()
    if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return apiError(error)
  }
}
