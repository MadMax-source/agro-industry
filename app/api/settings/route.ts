import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/server/mongodb'
import { initializeDemoCatalog } from '@/lib/server/initialize-catalog'
import { BusinessSettingsModel } from '@/lib/server/models'
import { apiError } from '@/lib/server/http'
import { settingsInputSchema } from '@/lib/server/validation'

export const runtime = 'nodejs'

export async function GET() {
  try {
    await connectToDatabase()
    await initializeDemoCatalog()
    const settings = await BusinessSettingsModel.findOne({ id: 'business-settings' }).lean()
    if (!settings) return NextResponse.json({ error: 'Business settings were not found.' }, { status: 404 })
    return NextResponse.json({ settings })
  } catch (error) {
    return apiError(error)
  }
}

export async function PATCH(request: Request) {
  try {
    await connectToDatabase()
    await initializeDemoCatalog()
    const input = settingsInputSchema.parse(await request.json())
    const settings = await BusinessSettingsModel.findOneAndUpdate(
      { id: 'business-settings' },
      { $set: input, $setOnInsert: { id: 'business-settings' } },
      { new: true, upsert: true, runValidators: true },
    ).lean()
    return NextResponse.json({ settings })
  } catch (error) {
    return apiError(error)
  }
}
