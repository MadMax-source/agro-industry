'use client'

import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Send } from 'lucide-react'
import { useSettings } from '@/hooks/use-storefront'
import { buildChatUrl } from '@/lib/whatsapp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface FormErrors {
  name?: string
  message?: string
}

export function ContactForm() {
  const settings = useSettings()
  const [errors, setErrors] = useState<FormErrors>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim().slice(0, 80)
    const phone = String(data.get('phone') ?? '').trim().slice(0, 20)
    const message = String(data.get('message') ?? '').trim().slice(0, 1000)

    const nextErrors: FormErrors = {}
    if (name.length < 2) nextErrors.name = 'Please enter your name.'
    if (message.length < 5) nextErrors.message = 'Please tell us a little more about what you need.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const text = [
      `Hello ${settings.businessName},`,
      '',
      message,
      '',
      `Name: ${name}`,
      phone ? `Phone: ${phone}` : null,
    ]
      .filter((line) => line !== null)
      .join('\n')

    const url = buildChatUrl(settings, text)
    if (!url) {
      toast.error('WhatsApp is not available right now', {
        description: `Please call us on ${settings.contactPhone} instead.`,
      })
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-border bg-card p-6 md:p-8">
      <h2 className="font-heading text-xl font-bold text-foreground">Send us a message</h2>
      <p className="mt-1 text-sm text-muted-foreground">Your message will open in WhatsApp, ready to send to our team.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-name">Full name</Label>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            maxLength={80}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className="h-11"
          />
          {errors.name && (
            <p id="contact-name-error" className="text-sm text-destructive">
              {errors.name}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-phone">
            Phone <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={20} className="h-11" />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="contact-message">How can we help?</Label>
          <Textarea
            id="contact-message"
            name="message"
            rows={6}
            maxLength={1000}
            placeholder="e.g. I need 10 bags of NPK 15-15-15 delivered to Ikorodu."
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
          />
          {errors.message && (
            <p id="contact-message-error" className="text-sm text-destructive">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-6 h-12 w-full sm:w-auto sm:px-8">
        <Send className="size-4" aria-hidden="true" />
        Send via WhatsApp
      </Button>
    </form>
  )
}
