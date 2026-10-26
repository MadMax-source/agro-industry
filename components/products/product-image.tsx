'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductImageProps {
  src?: string
  alt: string
  sizes: string
  priority?: boolean
  className?: string
}

/** Image with a branded fallback for missing or broken (e.g. user-supplied) URLs. */
export function ProductImage({ src, alt, sizes, priority, className }: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const broken = !src || failedSrc === src

  if (broken) {
    return (
      <div
        role="img"
        aria-label={`${alt} (image unavailable)`}
        className={cn('absolute inset-0 flex flex-col items-center justify-center gap-2 bg-secondary text-primary/50', className)}
      >
        <Leaf className="size-10" aria-hidden="true" />
        <span className="text-xs font-medium text-muted-foreground">Image coming soon</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailedSrc(src)}
      className={cn('object-cover', className)}
    />
  )
}
