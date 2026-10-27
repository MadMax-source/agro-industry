import 'server-only'
import { v2 as cloudinary } from 'cloudinary'

let configured = false

function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary environment variables are not configured.')
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    })
    configured = true
  }
}

export async function uploadImage(buffer: Buffer, folder: string) {
  configureCloudinary()

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `funalom/${folder}`, resource_type: 'image', allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'] },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }
        if (!result?.secure_url) {
          reject(new Error('Cloudinary did not return an image URL.'))
          return
        }
        resolve(result.secure_url)
      },
    )
    stream.end(buffer)
  })
}

export async function uploadVideo(buffer: Buffer) {
  configureCloudinary()

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'funalom/products', resource_type: 'video', allowed_formats: ['mp4', 'webm', 'mov'] },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }
        if (!result?.secure_url) {
          reject(new Error('Cloudinary did not return a video URL.'))
          return
        }
        resolve(result.secure_url)
      },
    )
    stream.end(buffer)
  })
}
