'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { ProductImage } from '@/components/products/product-image'
import { cn } from '@/lib/utils'

export function ProductGallery({ images, name, video }: { images: string[]; name: string; video?: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const safeIndex = Math.min(activeIndex, Math.max(images.length - 1, 0))

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-secondary">
        {showVideo && video ? (
          <video
            src={video}
            poster={images[0]}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 size-full object-contain"
            aria-label={`${name} product video`}
          />
        ) : (
          <ProductImage src={images[safeIndex]} alt={name} priority sizes="(min-width: 1024px) 50vw, 100vw" />
        )}
      </div>
      {(images.length > 1 || video) && (
        <ul className="grid grid-cols-4 gap-3" aria-label="Product images">
          {images.map((src, index) => (
            <li key={`${src}-${index}`}>
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(index)
                  setShowVideo(false)
                }}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={!showVideo && index === safeIndex}
                className={cn(
                  'relative block aspect-square w-full overflow-hidden rounded-lg border-2 bg-secondary transition-colors',
                  !showVideo && index === safeIndex ? 'border-primary' : 'border-transparent hover:border-border',
                )}
              >
                <ProductImage src={src} alt="" sizes="120px" />
              </button>
            </li>
          ))}
          {video && (
            <li>
              <button
                type="button"
                onClick={() => setShowVideo(true)}
                aria-label={`Play ${name} product video`}
                aria-current={showVideo}
                className={cn(
                  'relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border-2 bg-foreground text-background transition-colors',
                  showVideo ? 'border-primary' : 'border-transparent hover:border-border',
                )}
              >
                <ProductImage src={images[0]} alt="" sizes="120px" className="opacity-40" />
                <Play className="relative z-10 size-8 fill-current" aria-hidden="true" />
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
