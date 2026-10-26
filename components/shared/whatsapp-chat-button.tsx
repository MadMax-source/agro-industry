'use client'

import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { MessageCircle } from 'lucide-react'
import { useSettings } from '@/hooks/use-storefront'
import { buildChatUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

interface WhatsAppChatButtonProps {
  className?: string
  message?: string
  children?: ReactNode
  showIcon?: boolean
}

export function WhatsAppChatButton({
  className,
  message,
  children = 'Chat on WhatsApp',
  showIcon = true,
}: WhatsAppChatButtonProps) {
  const settings = useSettings()

  const handleClick = () => {
    const url = buildChatUrl(settings, message)
    if (!url) {
      toast.error('WhatsApp is not available right now', {
        description: `Please call us on ${settings.contactPhone} instead.`,
      })
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        className,
      )}
    >
      {showIcon && <MessageCircle className="size-4" aria-hidden="true" />}
      {children}
      <span className="sr-only">(opens WhatsApp in a new tab)</span>
    </button>
  )
}
