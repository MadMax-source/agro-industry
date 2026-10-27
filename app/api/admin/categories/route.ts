import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectToDatabase } from '@/lib/server/mongodb'
import { CategoryModel } from '@/lib/server/models'
import { apiError } from '@/lib/server/http'
import { categoryInputSchema } from '@/lib/server/validation'

export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectToDatabase()
    const categories = await CategoryModel.find().sort({ displayOrder: 1, name: 1 }).lean()
    return NextResponse.json({ categories })
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const input = categoryInputSchema.parse(await request.json())
    const category = await CategoryModel.create({ ...input, id: input.id ?? new Types.ObjectId().toString() })
    return NextResponse.json({ category: category.toJSON() }, { status: 201 })
  } catch (error) {
    return apiError(error)
  }
}
