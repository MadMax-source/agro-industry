import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/server/mongodb'
import { CategoryModel, ProductModel } from '@/lib/server/models'
import { apiError } from '@/lib/server/http'
import { categoryDeletionSchema, categoryInputSchema } from '@/lib/server/validation'

export const runtime = 'nodejs'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await connectToDatabase()
    const { id } = await params
    const category = await CategoryModel.findOne({ id }).lean()
    if (!category) return NextResponse.json({ error: 'Category not found.' }, { status: 404 })
    return NextResponse.json({ category })
  } catch (error) {
    return apiError(error)
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    await connectToDatabase()
    const { id } = await params
    const input = categoryInputSchema.parse(await request.json())
    const category = await CategoryModel.findOneAndUpdate(
      { id },
      { ...input, id },
      { new: true, runValidators: true },
    ).lean()
    if (!category) return NextResponse.json({ error: 'Category not found.' }, { status: 404 })
    return NextResponse.json({ category })
  } catch (error) {
    return apiError(error)
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    await connectToDatabase()
    const { id } = await params
    const body = categoryDeletionSchema.parse(await request.json())
    const categoryExists = await CategoryModel.exists({ id })
    if (!categoryExists) return NextResponse.json({ error: 'Category not found.' }, { status: 404 })

    if (body.strategy.type === 'reassign') {
      const { targetCategoryId } = body.strategy
      if (targetCategoryId === id || !(await CategoryModel.exists({ id: targetCategoryId }))) {
        return NextResponse.json({ error: 'The destination category is invalid.' }, { status: 400 })
      }
      await ProductModel.updateMany({ categoryId: id }, { $set: { categoryId: targetCategoryId } })
    } else {
      await ProductModel.updateMany({ categoryId: id }, { $set: { categoryId: '', status: 'draft' } })
    }

    const category = await CategoryModel.findOneAndDelete({ id }).lean()
    if (!category) return NextResponse.json({ error: 'Category not found.' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return apiError(error)
  }
}
