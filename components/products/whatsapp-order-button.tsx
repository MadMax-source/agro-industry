'use client'

import { toast } from 'sonner'
import { MessageCircle } from 'lucide-react'
import type { Product } from '@/types'
import { useSettings } from '@/hooks/use-storefront'
import { buildOrderUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

interface WhatsAppOrderButtonProps {
  product: Product
  quantity?: number
  size?: 'default' | 'lg'
  className?: string
}

export function WhatsAppOrderButton({ product, quantity = 1, size = 'default', className }: WhatsAppOrderButtonProps) {
  const settings = useSettings()
  const outOfStock = product.stock <= 0

  const handleClick = () => {
    if (outOfStock) return
    const safeQuantity = Math.min(Math.max(1, Math.floor(quantity)), product.stock)
    const productUrl = `${window.location.origin}/products/${product.slug}`
    const url = buildOrderUrl(settings, product, safeQuantity, productUrl)

    if (!url) {
      toast.error('WhatsApp ordering is unavailable', {
        description: `Our WhatsApp line is being set up. Please call ${settings.contactPhone} to order.`,
      })
      return
    }

    window.open(url, '_blank', 'noopener,noreferrer')
    toast.success('Opening WhatsApp', {
      description: `Your order for ${safeQuantity} × ${product.name} is ready to send.`,
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={outOfStock}
      aria-label={outOfStock ? `${product.name} is out of stock` : `Buy ${product.name} on WhatsApp`}
      className={cn(
        'inline-flex w-full items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        size === 'lg' ? 'h-12 px-6 text-base' : 'h-10 px-4 text-sm',
        outOfStock
          ? 'cursor-not-allowed bg-muted text-muted-foreground'
          : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.99]',
        className,
      )}
    >
      <MessageCircle className={size === 'lg' ? 'size-5' : 'size-4'} aria-hidden="true" />
      {outOfStock ? 'Out of Stock' : 'Buy on WhatsApp'}
    </button>
  )
}
