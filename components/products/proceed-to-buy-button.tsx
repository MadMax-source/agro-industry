'use client'

import { toast } from 'sonner'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'
import { useSettings } from '@/hooks/use-storefront'
import { buildOrderUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

interface ProceedToBuyButtonProps {
  product: Product
  quantity?: number
  className?: string
  onProceed?: () => void
}

/** Final step of the buy flow: hands the pre-filled order off to the sales team on WhatsApp. */
export function ProceedToBuyButton({ product, quantity = 1, className, onProceed }: ProceedToBuyButtonProps) {
  const settings = useSettings()
  const outOfStock = product.stock <= 0

  const handleClick = () => {
    if (outOfStock) return
    const safeQuantity = Math.min(Math.max(1, Math.floor(quantity)), product.stock)
    const productUrl = `${window.location.origin}/products/${product.slug}`
    const url = buildOrderUrl(settings, product, safeQuantity, productUrl)

    if (!url) {
      toast.error('Online ordering is unavailable', {
        description: `Our ordering line is being set up. Please call ${settings.contactPhone} to order.`,
      })
      return
    }

    window.open(url, '_blank', 'noopener,noreferrer')
    toast.success('Order ready to send', {
      description: `Confirm ${safeQuantity} × ${product.name} with our team in WhatsApp.`,
    })
    onProceed?.()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={outOfStock}
      className={cn(
        'group/proceed inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg px-6 text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        outOfStock
          ? 'cursor-not-allowed bg-muted text-muted-foreground'
          : 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg active:scale-[0.99]',
        className,
      )}
    >
      <ShoppingBag className="size-5" aria-hidden="true" />
      {outOfStock ? 'Out of Stock' : 'Proceed to Buy'}
      {!outOfStock && (
        <>
          <ArrowRight className="size-4 transition-transform group-hover/proceed:translate-x-1" aria-hidden="true" />
          <span className="sr-only">(opens WhatsApp in a new tab)</span>
        </>
      )}
    </button>
  )
}
