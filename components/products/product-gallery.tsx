'use client'

import { useState } from 'react'
import { ProductImage } from '@/components/products/product-image'
import { cn } from '@/lib/utils'

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const safeIndex = Math.min(activeIndex, Math.max(images.length - 1, 0))

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-secondary">
        <ProductImage src={images[safeIndex]} alt={name} priority sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      {images.length > 1 && (
        <ul className="grid grid-cols-4 gap-3" aria-label="Product images">
          {images.map((src, index) => (
            <li key={`${src}-${index}`}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={index === safeIndex}
                className={cn(
                  'relative block aspect-square w-full overflow-hidden rounded-lg border-2 bg-secondary transition-colors',
                  index === safeIndex ? 'border-primary' : 'border-transparent hover:border-border',
                )}
              >
                <ProductImage src={src} alt="" sizes="120px" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
