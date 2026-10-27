import { NextResponse } from 'next/server'
import { apiError } from '@/lib/server/http'
import { sendContactEmail } from '@/lib/server/mailer'
import { contactInputSchema } from '@/lib/server/validation'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const input = contactInputSchema.parse(await request.json())
    await sendContactEmail(input)
    return NextResponse.json({ success: true }, { status: 202 })
  } catch (error) {
    return apiError(error)
  }
}
