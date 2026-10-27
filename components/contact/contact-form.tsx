'use client'

import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

export function ContactForm() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim().slice(0, 80)
    const email = String(data.get('email') ?? '').trim().slice(0, 254)
    const phone = String(data.get('phone') ?? '').trim().slice(0, 20)
    const message = String(data.get('message') ?? '').trim().slice(0, 2000)

    const nextErrors: FormErrors = {}
    if (name.length < 2) nextErrors.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Please enter a valid email address.'
    if (message.length < 5) nextErrors.message = 'Please tell us a little more about what you need.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      })
      const result: unknown = await response.json()
      if (!response.ok) {
        const errorMessage =
          result && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
            ? result.error
            : 'Your message could not be sent. Please try again.'
        throw new Error(errorMessage)
      }
      form.reset()
      setErrors({})
      toast.success('Your message has been sent. We will get back to you soon.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Your message could not be sent. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-border bg-card p-6 md:p-8">
      <h2 className="font-heading text-xl font-bold text-foreground">Send us a message</h2>
      <p className="mt-1 text-sm text-muted-foreground">Send your enquiry directly to our team by email.</p>

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
          <Label htmlFor="contact-email">Email address</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className="h-11"
          />
          {errors.email && (
            <p id="contact-email-error" className="text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="contact-message">How can we help?</Label>
          <Textarea
            id="contact-message"
            name="message"
            rows={6}
            maxLength={2000}
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

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-6 h-12 w-full sm:w-auto sm:px-8">
        {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
        {isSubmitting ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}
