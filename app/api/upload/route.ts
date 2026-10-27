import { NextResponse } from 'next/server'
import { apiError } from '@/lib/server/http'
import { uploadImage, uploadVideo } from '@/lib/server/cloudinary'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 4 * 1024 * 1024
const MAX_VIDEO_SIZE = 50 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const ALLOWED_VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime'])

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const folder = formData.get('folder')
    const mediaType = formData.get('mediaType') ?? 'image'

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Choose an image file to upload.' }, { status: 400 })
    }
    if (folder !== 'products' && folder !== 'categories') {
      return NextResponse.json({ error: 'Choose a valid image folder.' }, { status: 400 })
    }
    if (mediaType === 'video') {
      if (folder !== 'products') {
        return NextResponse.json({ error: 'Videos can only be uploaded to products.' }, { status: 400 })
      }
      if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
        return NextResponse.json({ error: 'Use an MP4, WebM, or MOV video.' }, { status: 400 })
      }
      if (file.size === 0 || file.size > MAX_VIDEO_SIZE) {
        return NextResponse.json({ error: 'Video files must be smaller than 50 MB.' }, { status: 400 })
      }
      const url = await uploadVideo(Buffer.from(await file.arrayBuffer()))
      return NextResponse.json({ url }, { status: 201 })
    }
    if (mediaType !== 'image') {
      return NextResponse.json({ error: 'Choose a valid media type.' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Use a JPEG, PNG, WebP, or AVIF image.' }, { status: 400 })
    }
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image files must be smaller than 4 MB.' }, { status: 400 })
    }

    const url = await uploadImage(Buffer.from(await file.arrayBuffer()), folder)
    return NextResponse.json({ url }, { status: 201 })
  } catch (error) {
    return apiError(error)
  }
}
