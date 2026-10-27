import 'server-only'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function apiError(error: unknown) {
  if (error instanceof SyntaxError) {
    return NextResponse.json({ error: 'Request body must contain valid JSON.' }, { status: 400 })
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Invalid request data.', details: error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })) },
      { status: 400 },
    )
  }

  if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
    return NextResponse.json({ error: 'A record with the same slug or SKU already exists.' }, { status: 409 })
  }

  if (error && typeof error === 'object' && 'name' in error && error.name === 'MongooseServerSelectionError') {
    console.error('MongoDB server selection failed:', error)
    return NextResponse.json(
      {
        error:
          "Unable to connect to MongoDB. Check the MONGODB_URI and allow this server's IP address in MongoDB Atlas Network Access.",
      },
      { status: 503 },
    )
  }

  console.error('API request failed:', error)
  return NextResponse.json({ error: 'The request could not be completed.' }, { status: 500 })
}
