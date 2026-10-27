import 'server-only'
import mongoose from 'mongoose'

interface MongoConnection {
  connection: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoConnection?: MongoConnection
}

const cached = (globalForMongo.mongoConnection ??= { connection: null, promise: null })

export async function connectToDatabase() {
  if (cached.connection) return cached.connection

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI is not configured.')
    cached.promise = mongoose.connect(uri, { bufferCommands: false })
  }

  try {
    cached.connection = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.connection
}
